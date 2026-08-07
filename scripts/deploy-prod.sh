#!/usr/bin/env bash
# Сборка production-образа cuppcake локально и выкат на VPS.
#
# Usage:
#   DEPLOY_SSH_PASSWORD='...' ./scripts/deploy-prod.sh
#   DEPLOY_SSH_PASSWORD='...' DEPLOY_RUN_SEED=1 ./scripts/deploy-prod.sh   # первый деплой
#
# Env (optional):
#   DEPLOY_HOST              default: 157.22.196.76
#   DEPLOY_USER              default: root
#   DEPLOY_DIR               default: /var/www/www-root/data/product-catalog-next-app
#   DEPLOY_COMPOSE_LOCAL     default: docker-compose.prod.yml
#   DEPLOY_COMPOSE_REMOTE    default: docker-compose.yml
#   DEPLOY_IMAGE             default: product-catalog-next-app:latest
#   DEPLOY_APP_PORT          default: 3001
#   DEPLOY_SSH_PASSWORD      password auth via sshpass / SSH_ASKPASS
#   DEPLOY_SKIP_BUILD=1      не пересобирать образ
#   DEPLOY_SYNC_COMPOSE=0    не заливать compose
#   DEPLOY_SYNC_ENV=0        не заливать .env.production → remote .env
#   DEPLOY_ENV_LOCAL         default: .env.production
#   DEPLOY_RUN_SEED=1        один раз: RUN_SEED=1 при recreate
#   DEPLOY_SKIP_PRUNE=1      не чистить dangling-образы
#   DEPLOY_SITE_DOMAIN       default: cuppcake.my-crazy-master.ru

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DEPLOY_HOST="${DEPLOY_HOST:-157.22.196.76}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/www-root/data/product-catalog-next-app}"
DEPLOY_COMPOSE_LOCAL="${DEPLOY_COMPOSE_LOCAL:-docker-compose.prod.yml}"
DEPLOY_COMPOSE_REMOTE="${DEPLOY_COMPOSE_REMOTE:-docker-compose.yml}"
DEPLOY_IMAGE="${DEPLOY_IMAGE:-product-catalog-next-app:latest}"
DEPLOY_APP_PORT="${DEPLOY_APP_PORT:-3001}"
DEPLOY_ENV_LOCAL="${DEPLOY_ENV_LOCAL:-.env.production}"
DEPLOY_SITE_DOMAIN="${DEPLOY_SITE_DOMAIN:-cuppcake.my-crazy-master.ru}"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"
TAR_LOCAL="${TMPDIR:-/tmp}/product-catalog-next-app.tar.gz"
COMPOSE_BIN="${DEPLOY_COMPOSE_BIN:-/usr/local/bin/docker-compose}"

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

require_cmd docker
require_cmd ssh
require_cmd scp
require_cmd gzip

cleanup() {
  if [[ -n "$ASKPASS_FILE" && -f "$ASKPASS_FILE" ]]; then
    rm -f "$ASKPASS_FILE"
  fi
  rm -f "$TAR_LOCAL"
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

setup_ssh_auth

if [[ "${DEPLOY_SKIP_BUILD:-0}" != "1" ]]; then
  log "Build ${DEPLOY_IMAGE}"
  docker build --target=production -t "$DEPLOY_IMAGE" .
else
  log "Skip build (DEPLOY_SKIP_BUILD=1), use existing ${DEPLOY_IMAGE}"
  docker image inspect "$DEPLOY_IMAGE" >/dev/null 2>&1 \
    || die "локальный образ не найден: ${DEPLOY_IMAGE}"
fi

log "Pack image → ${TAR_LOCAL}"
docker save "$DEPLOY_IMAGE" | gzip -1 >"$TAR_LOCAL"
ls -lh "$TAR_LOCAL"

log "Ensure remote dir ${DEPLOY_DIR}"
run_ssh "mkdir -p $(printf '%q' "$DEPLOY_DIR")"

log "Upload image to ${REMOTE}"
run_scp "$TAR_LOCAL" "${REMOTE}:/tmp/product-catalog-next-app.tar.gz"

if [[ "${DEPLOY_SYNC_COMPOSE:-1}" != "0" ]]; then
  [[ -f "$DEPLOY_COMPOSE_LOCAL" ]] || die "нет файла ${DEPLOY_COMPOSE_LOCAL}"
  log "Upload ${DEPLOY_COMPOSE_LOCAL} → ${DEPLOY_DIR}/${DEPLOY_COMPOSE_REMOTE}"
  run_scp "$DEPLOY_COMPOSE_LOCAL" "${REMOTE}:${DEPLOY_DIR}/${DEPLOY_COMPOSE_REMOTE}"
fi

if [[ "${DEPLOY_SYNC_ENV:-1}" != "0" ]]; then
  [[ -f "$DEPLOY_ENV_LOCAL" ]] || die "нет файла ${DEPLOY_ENV_LOCAL} (скопируй из .env.production.example)"
  log "Upload ${DEPLOY_ENV_LOCAL} → ${DEPLOY_DIR}/.env"
  run_scp "$DEPLOY_ENV_LOCAL" "${REMOTE}:${DEPLOY_DIR}/.env"
fi

log "Load image and recreate app on server"
# shellcheck disable=SC2087
run_ssh bash -s <<EOF
set -euo pipefail

SKIP_PRUNE=$(printf '%q' "${DEPLOY_SKIP_PRUNE:-0}")
RUN_SEED=$(printf '%q' "${DEPLOY_RUN_SEED:-0}")
DEPLOY_DIR_Q=$(printf '%q' "$DEPLOY_DIR")
COMPOSE_REMOTE_Q=$(printf '%q' "$DEPLOY_COMPOSE_REMOTE")
COMPOSE_BIN_Q=$(printf '%q' "$COMPOSE_BIN")
APP_PORT_Q=$(printf '%q' "$DEPLOY_APP_PORT")
SITE_DOMAIN_Q=$(printf '%q' "$DEPLOY_SITE_DOMAIN")

prune_dangling_images() {
  if [ "\$SKIP_PRUNE" = "1" ]; then
    return 0
  fi
  echo "==> Docker image prune (dangling)"
  docker image prune -f
  df -h / | tail -n 1 || true
}

upsert_env_key() {
  local file="\$1"
  local key="\$2"
  local value="\$3"
  local tmp
  touch "\$file"
  tmp="\$(mktemp)"
  grep -vE "^\$\{key\}=" "\$file" >"\$tmp" || true
  printf '%s=%s\n' "\$key" "\$value" >>"\$tmp"
  mv "\$tmp" "\$file"
}

prune_dangling_images

gunzip -c /tmp/product-catalog-next-app.tar.gz | docker load
rm -f /tmp/product-catalog-next-app.tar.gz

cd "\$DEPLOY_DIR_Q"

if [ ! -f .env ]; then
  echo "ERROR: нет \$DEPLOY_DIR_Q/.env" >&2
  exit 1
fi

upsert_env_key .env RUN_SEED 0
upsert_env_key .env RUN_MIGRATIONS 1

if [ -x "\$COMPOSE_BIN_Q" ]; then
  COMPOSE="\$COMPOSE_BIN_Q"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=docker-compose
else
  COMPOSE='docker compose'
fi

# Postgres my-master должен быть в той же сети.
if ! docker network inspect my-master-network >/dev/null 2>&1; then
  echo "ERROR: docker network my-master-network не найден" >&2
  exit 1
fi

\$COMPOSE -f "\$COMPOSE_REMOTE_Q" up -d --force-recreate --no-deps app

prune_dangling_images

sleep 10
docker ps --filter name=product-catalog-next-app --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'
echo '---LOGS---'
docker logs --tail=80 product-catalog-next-app 2>&1 || true
echo '---HEALTH---'
curl -sS -D- -o /dev/null --max-time 15 \
  -H "Host: \$SITE_DOMAIN_Q" \
  -H "X-Forwarded-Host: \$SITE_DOMAIN_Q" \
  -H 'X-Forwarded-Proto: https' \
  "http://127.0.0.1:\${APP_PORT_Q}/" | head -20 || true
EOF

log "Done: ${DEPLOY_IMAGE} → ${REMOTE} (${DEPLOY_SITE_DOMAIN})"

if [[ "${DEPLOY_RUN_SEED:-0}" == "1" ]]; then
  log "Seed against remote Postgres (5442) + sync uploads into volume"
  REMOTE_DATABASE_URL="${DEPLOY_SEED_DATABASE_URL:-postgresql://app:app@${DEPLOY_HOST}:5442/cuppcake?schema=public}"
  DATABASE_URL="$REMOTE_DATABASE_URL" npm run db:seed

  UPLOADS_TAR="${TMPDIR:-/tmp}/cuppcake-uploads.tgz"
  tar -C public/uploads -czf "$UPLOADS_TAR" .
  run_scp "$UPLOADS_TAR" "${REMOTE}:/tmp/cuppcake-uploads.tgz"
  rm -f "$UPLOADS_TAR"

  run_ssh bash -s <<EOF
set -euo pipefail
UPLOAD_DIR=$(printf '%q' "${DEPLOY_DIR}/uploads")
mkdir -p "\$UPLOAD_DIR"
tar -xzf /tmp/cuppcake-uploads.tgz -C "\$UPLOAD_DIR"
rm -f /tmp/cuppcake-uploads.tgz
chown -R 1001:1001 "\$UPLOAD_DIR" 2>/dev/null || true
echo "==> uploads synced into \$UPLOAD_DIR"
EOF
fi

log "Nginx/SSL: DEPLOY_CERTBOT=1 ./scripts/deploy-nginx.sh (если сертификата ещё нет)"
