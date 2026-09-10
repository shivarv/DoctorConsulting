#!/usr/bin/env bash
#
# Load the schema and the demo data into a database.
#
#     ./db/bootstrap.sh                          # uses $DATABASE_URL
#     ./db/bootstrap.sh "postgresql://user:pw@host/db"
#
# This is how a deployed database gets its contents. A managed Postgres
# (Render, Neon, Supabase, RDS) starts empty and has no equivalent of the
# docker-entrypoint-initdb.d hook that docker-compose relies on locally, so the
# SQL in this directory has to be pushed in from outside exactly once.
#
# Safe to re-run, and re-running is the intended way to update demo data:
# schema.sql guards every statement with IF NOT EXISTS, and seed_doctors.sql
# upserts every row and rebuilds doctor_conditions wholesale. Edit the SQL,
# run this again, and the deployed data matches — no migration needed.
#
# What it does NOT do:
#   * roles.sql is skipped. It creates `dc_app` with a hardcoded development
#     password, which has no place in a deployed database. Managed providers
#     give you one owner role and its connection string; use that.
#   * It never drops or alters an existing table. Once real appointments exist,
#     a schema change needs a proper migration, not this script.

set -euo pipefail

DB_URL="${1:-${DATABASE_URL:-}}"

if [[ -z "$DB_URL" ]]; then
    cat >&2 <<'USAGE'
error: no database URL given.

Pass one as an argument, or export DATABASE_URL first:

    ./db/bootstrap.sh "postgresql://user:password@host:5432/dbname"

On Render, copy the *External* Database URL from the database's dashboard
page — the internal one only resolves from inside Render's network.
USAGE
    exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
    echo "error: psql not found on PATH. Install the postgresql client." >&2
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Everything after the last @ — host, port and database, but never the
# password, so this is safe to show and safe to paste into a bug report.
echo "Target: $(printf '%s' "$DB_URL" | sed -E 's#^.*@#@#')"
echo

# ON_ERROR_STOP makes psql exit non-zero on the first failure; without it psql
# reports the error, carries on, and still exits 0, so a broken load would look
# like a success. client_min_messages hides the "relation already exists,
# skipping" NOTICE that every IF NOT EXISTS emits on a re-run — expected here,
# and fifteen of them bury anything that matters. Warnings and errors still show.
PSQL_OPTS=(--quiet --no-psqlrc -v ON_ERROR_STOP=1 --set=client_min_messages=warning)

apply() {
    echo "==> $1"
    psql "$DB_URL" "${PSQL_OPTS[@]}" -f "$SCRIPT_DIR/$1"
}

apply schema.sql
apply seed_doctors.sql

echo
echo "==> Contents"
psql "$DB_URL" "${PSQL_OPTS[@]}" -c "
    SELECT 'conditions'         AS table, count(*) AS rows FROM conditions
    UNION ALL
    SELECT 'doctors',            count(*) FROM doctors
    UNION ALL
    SELECT 'doctor_conditions',  count(*) FROM doctor_conditions
    UNION ALL
    SELECT 'users',              count(*) FROM users
    UNION ALL
    SELECT 'appointments',       count(*) FROM appointments
    UNION ALL
    SELECT 'testimonials',       count(*) FROM testimonials
    ORDER BY 1;
"

echo "Done."
