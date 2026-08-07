#!/bin/sh
set -eu

ensure_database_schema() {
  node <<'NODE'
const { Client } = require('pg');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const url = new URL(databaseUrl);
const schema = url.searchParams.get('schema') || 'public';

(async () => {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema.replace(/"/g, '""')}"`);
    console.log(`==> schema ready: ${schema}`);
  } finally {
    await client.end();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
NODE
}

if [ "${RUN_MIGRATIONS:-1}" = "1" ]; then
  echo "==> ensure schema + prisma migrate deploy"
  ensure_database_schema
  npx prisma migrate deploy
fi

exec "$@"
