-- The application's login role.
--
--     psql -d doctorconsulting -f db/roles.sql
--
-- Run after schema.sql, since the grants below need the tables to exist.
-- Safe to re-run: the role is only created if missing, and grants are
-- idempotent.
--
-- `dc_app` is deliberately not a superuser and does not own the tables. It can
-- read and write rows but cannot drop or alter them, so a bug in a query
-- cannot destroy the schema. Schema changes go through the `postgres` role.
--
-- The password here is a local development value. A real deployment should
-- create this role separately with a secret that never enters the repository.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'dc_app') THEN
        CREATE ROLE dc_app LOGIN PASSWORD 'dc_local_dev';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE doctorconsulting TO dc_app;
GRANT USAGE ON SCHEMA public TO dc_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO dc_app;
-- Identity columns draw from sequences, so inserting needs these too.
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO dc_app;

-- Same rights on anything added later, so a new table needs no re-grant.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO dc_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO dc_app;
