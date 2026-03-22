#!/bin/sh
set -e

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}

echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
until PGPASSWORD="${POSTGRES_PASSWORD}" pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${POSTGRES_USER}" >/dev/null 2>&1; do
  sleep 2
done

echo "PostgreSQL is ready. Running migrations..."
npx prisma migrate deploy

if [ "${SEED_DB}" = "true" ]; then
  echo "Seeding database..."
  npx prisma db seed
fi

echo "Starting application..."
exec "$@"
