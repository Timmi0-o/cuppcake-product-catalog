#!/usr/bin/env bash
# Раскатка nginx для cuppcake + выпуск/проверка Let's Encrypt.
#
# Usage:
#   DEPLOY_SSH_PASSWORD='...' ./scripts/deploy-nginx.sh
#   DEPLOY_SSH_PASSWORD='...' DEPLOY_CERTBOT=1 ./scripts/deploy-nginx.sh
#
# Env (optional):
#   DEPLOY_HOST
#   DEPLOY_USER
#   DEPLOY_SSH_PASSWORD
#   NGINX_CONF_LOCAL         default: deploy/nginx-cuppcake.conf
#   NGINX_CONF_HTTP_LOCAL    default: deploy/nginx-cuppcake.http.conf
#   NGINX_CONF_REMOTE        default: /etc/nginx/sites-available/cuppcake
#   NGINX_SITE_DOMAIN        default: cuppcake.my-crazy-master.ru
#   DEPLOY_CERTBOT=1         если сертификата нет — HTTP bootstrap + certbot --nginx

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DEPLOY_HOST="${DEPLOY_HOST:-157.22.196.76}"
DEPLOY_USER="${DEPLOY_USER:-root}"
NGINX_CONF_LOCAL="${NGINX_CONF_LOCAL:-deploy/nginx-cuppcake.conf}"
NGINX_CONF_HTTP_LOCAL="${NGINX_CONF_HTTP_LOCAL:-deploy/nginx-cuppcake.http.conf}"
NGINX_CONF_REMOTE="${NGINX_CONF_REMOTE:-/etc/nginx/sites-available/cuppcake}"
NGINX_SITE_DOMAIN="${NGINX_SITE_DOMAIN:-cuppcake.my-crazy-master.ru}"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"
UPLOAD_PATH="/tmp/nginx-cuppcake.$(date -u +%Y%m%d%H%M%S).conf"

SSH_PREFIX=()
SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30)
ASKPASS_FILE=""

log() {
  printf '==> %s\n' "$*"
}

die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "нужна команда: $1"
}

require_cmd ssh
require_cmd scp

cleanup() {
  if [[ -n "$ASKPASS_FILE" && -f "$ASKPASS_FILE" ]]; then
    rm -f "$ASKPASS_FILE"
  fi
}
trap cleanup EXIT

setup_ssh_auth() {
  if [[ -z "${DEPLOY_SSH_PASSWORD:-}" ]]; then
    return 0
  fi

  if command -v sshpass >/dev/null 2>&1; then
    export SSHPASS="$DEPLOY_SSH_PASSWORD"
    SSH_PREFIX=(sshpass -e)
    SSH_OPTS+=(-o PreferredAuthentications=password -o PubkeyAuthentication=no)
    return 0
  fi

  ASKPASS_FILE="$(mktemp)"
  {
    printf '%s\n' '#!/bin/sh'
    printf "printf '%%s\\n' %q\n" "$DEPLOY_SSH_PASSWORD"
  } >"$ASKPASS_FILE"
  chmod 700 "$ASKPASS_FILE"
  export DISPLAY="${DISPLAY:-}"
  export SSH_ASKPASS="$ASKPASS_FILE"
  export SSH_ASKPASS_REQUIRE=force
  SSH_OPTS+=(-o PreferredAuthentications=password -o PubkeyAuthentication=no)
}

run_ssh() {
  if ((${#SSH_PREFIX[@]} > 0)); then
    "${SSH_PREFIX[@]}" ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
  else
    ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
  fi
}

run_scp() {
  if ((${#SSH_PREFIX[@]} > 0)); then
    "${SSH_PREFIX[@]}" scp "${SSH_OPTS[@]}" "$@"
  else
    scp "${SSH_OPTS[@]}" "$@"
  fi
}

[[ -f "$NGINX_CONF_LOCAL" ]] || die "нет файла ${NGINX_CONF_LOCAL}"
[[ -f "$NGINX_CONF_HTTP_LOCAL" ]] || die "нет файла ${NGINX_CONF_HTTP_LOCAL}"

setup_ssh_auth

HAS_CERT="$(
  run_ssh "if [ -f /etc/letsencrypt/live/$(printf '%q' "$NGINX_SITE_DOMAIN")/fullchain.pem ]; then echo yes; else echo no; fi"
)"

if [[ "$HAS_CERT" != "yes" ]]; then
  if [[ "${DEPLOY_CERTBOT:-0}" != "1" ]]; then
    die "сертификата для ${NGINX_SITE_DOMAIN} нет. Запусти с DEPLOY_CERTBOT=1"
  fi

  log "No cert yet — upload HTTP bootstrap + enable site + certbot"
  run_scp "$NGINX_CONF_HTTP_LOCAL" "${REMOTE}:${UPLOAD_PATH}"
  # shellcheck disable=SC2087
  run_ssh bash -s <<EOF
set -euo pipefail
CONF=$(printf '%q' "$NGINX_CONF_REMOTE")
UPLOAD=$(printf '%q' "$UPLOAD_PATH")
DOMAIN=$(printf '%q' "$NGINX_SITE_DOMAIN")

install -m 0644 -o root -g root "\$UPLOAD" "\$CONF"
rm -f "\$UPLOAD"
ln -sfn "\$CONF" /etc/nginx/sites-enabled/cuppcake
nginx -t
systemctl reload nginx

certbot --nginx -d "\$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect
EOF
else
  log "Cert exists — upload full SSL nginx conf"
  run_scp "$NGINX_CONF_LOCAL" "${REMOTE}:${UPLOAD_PATH}"
  # shellcheck disable=SC2087
  run_ssh bash -s <<EOF
set -euo pipefail

CONF=$(printf '%q' "$NGINX_CONF_REMOTE")
UPLOAD=$(printf '%q' "$UPLOAD_PATH")
DOMAIN=$(printf '%q' "$NGINX_SITE_DOMAIN")
BACKUP="\${CONF}.bak.\$(date -u +%Y%m%d%H%M%S)"

if [ -f "\$CONF" ]; then
  cp -a "\$CONF" "\$BACKUP"
  echo "==> Backup: \$BACKUP"
fi

install -m 0644 -o root -g root "\$UPLOAD" "\$CONF"
rm -f "\$UPLOAD"
ln -sfn "\$CONF" /etc/nginx/sites-enabled/cuppcake

if ! nginx -t; then
  echo "ERROR: nginx -t не прошёл, откатываюсь" >&2
  if [ -n "\${BACKUP:-}" ] && [ -f "\$BACKUP" ]; then
    cp -a "\$BACKUP" "\$CONF"
    nginx -t
  fi
  exit 1
fi

systemctl reload nginx
echo "==> nginx reloaded"

echo '---CHECK---'
curl -sSk --resolve "\${DOMAIN}:443:127.0.0.1" \
  -o /tmp/nginx-cuppcake-check.html \
  -w 'http=%{http_version} code=%{http_code} time=%{time_total}s size=%{size_download}\n' \
  --max-time 30 "https://\${DOMAIN}/" || true
rm -f /tmp/nginx-cuppcake-check.html
EOF
fi

log "Done: nginx → ${REMOTE}:${NGINX_CONF_REMOTE}"
