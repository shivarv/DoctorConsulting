# Running in Docker

Three containers — Postgres, the FastAPI backend, the Vite frontend — wired
together by `docker-compose.yml`.

## Prerequisite

Docker is not installed on this machine yet.

**Don't use Homebrew for it.** The cask is broken against Homebrew 5.1.0 here:
`Cask 'docker-desktop' definition is invalid: undefined method
'postflight_steps'`. Download it directly instead — this Mac is Apple Silicon
(arm64):

<https://desktop.docker.com/mac/main/arm64/Docker.dmg>

Open the .dmg, drag Docker to Applications, launch it, and accept the
permission prompt. Wait for the whale icon in the menu bar to stop animating,
then confirm the daemon is up:

```bash
docker info
```

A `Cannot connect to the Docker daemon` error means Docker Desktop isn't
running yet.

## Start

```bash
docker compose up --build
```

First run takes a few minutes (pulling images, `npm ci`). Then:

| Service | URL | Notes |
|---|---|---|
| Frontend | http://localhost:5173 | Vite dev server, hot reload |
| API | http://localhost:8000 | uvicorn with `--reload` |
| API docs | http://localhost:8000/docs | FastAPI's generated Swagger UI |
| Postgres | `localhost:5433` | **5433**, not 5432 — see below |

Stop with `Ctrl+C`, or `docker compose down` from another terminal.

## Why Postgres is on 5433

You already run Postgres 18 natively on 5432. Two servers cannot bind the same
host port, so the container publishes 5433 instead. Both can run at once.

Inside the compose network the container is still on 5432, which is why
`DATABASE_URL` reads `@db:5432` — `db` is the service name, resolved by
compose's internal DNS.

To connect to the *containerised* database from your terminal:

```bash
PGPASSWORD=dc_local_dev psql -h localhost -p 5433 -U dc_app -d doctorconsulting
```

Drop the `-p 5433` and you're talking to your native install instead. Worth
keeping straight — they hold separate data.

## Native and Docker side by side

Nothing was removed. Both still work:

```bash
# native — reads .env, connects to localhost:5432
.venv/bin/python -m uvicorn src.main:app --reload
cd frontend && npm run dev

# docker — compose sets DATABASE_URL to db:5432
docker compose up
```

The `.env` file on disk points at `localhost:5432`, i.e. your native server.
Compose sets `DATABASE_URL` as a real environment variable, and `load_dotenv`
does not override those, so the container ignores the file and uses `db:5432`.
That precedence is what lets one repository serve both.

## The database is initialised automatically

On the **first** start with an empty volume, the Postgres image runs everything
in `/docker-entrypoint-initdb.d/` in filename order:

```
01-schema.sql   → db/schema.sql        creates the six tables
02-seed.sql     → db/seed_doctors.sql  12 conditions, 18 doctors
03-roles.sql    → db/roles.sql         creates dc_app and grants it rights
```

These run **only** on a virgin data directory. Editing `db/schema.sql` later
does nothing until you discard the volume:

```bash
docker compose down -v      # -v deletes pgdata, so the next `up` re-runs them
docker compose up --build
```

Without `-v`, `down` keeps your data.

## What is mounted

| Host | Container | Why |
|---|---|---|
| `./src` | `/app/src` | edit Python, uvicorn reloads |
| `./frontend` | `/app` | edit React, Vite reloads |
| `./frontend/public/videos` | `/app/videos` (read-only) | the backend scans these to build bundles; they're gitignored, so they must be mounted rather than baked in |
| `pgdata` volume | `/var/lib/postgresql` | database survives restarts. Not `.../data` — postgres:18+ stores data in a version subdirectory and refuses to start if you mount `data` directly. |

`node_modules` is an anonymous volume so the container keeps its own Linux
build rather than having the macOS one shadow it through the bind mount.

## Everyday commands

```bash
docker compose up                     # start (after the first build)
docker compose up --build             # rebuild images first
docker compose down                   # stop, keep data
docker compose down -v                # stop and wipe the database
docker compose logs -f api            # follow one service's logs
docker compose exec api bash          # shell into the backend
docker compose exec db psql -U postgres -d doctorconsulting
docker compose ps                     # what's running
```

Run the test suite inside the container:

```bash
docker compose exec api python -m pytest -q
```

That needs `tests/` mounted, which it isn't by default — add
`- ./tests:/app/tests` to the api service's volumes if you want this.

## Rebuild when dependencies change

Editing source is picked up live. Editing `requirements.txt` or
`frontend/package.json` is not — those are baked into the image:

```bash
docker compose up --build
```

## Not set up for production

This is a development stack, deliberately:

- Both servers run in reload mode, which is slower and not hardened.
- The frontend is the Vite dev server, not a static build behind nginx.
- Passwords are development values committed in `docker-compose.yml`.
- `POSTGRES_PASSWORD` is `postgres`.

A production setup would need a multi-stage frontend build served by nginx, no
bind mounts, secrets from the environment rather than the compose file, and
`--workers` instead of `--reload`. One wrinkle to plan for: Vite inlines
`VITE_API_BASE_URL` at build time, so the API URL must be known when the image
is built, or read at runtime some other way.

## Verified and not

Tested on this machine without Docker:

- `db/schema.sql` → `db/seed_doctors.sql` → `db/roles.sql` run cleanly in that
  order on a virgin database, producing 18 doctors and 12 conditions, with
  `dc_app` able to SELECT and INSERT but not TRUNCATE.
- `db/roles.sql` is idempotent across repeat runs.
- `VIDEOS_DIR=/app/videos` resolves as an absolute path.
- Environment variables take precedence over the `.env` file.
- `docker-compose.yml` parses and has the intended shape.

**Not** tested: the images actually building, and the three containers talking
to each other. Docker isn't installed here, so that needs your first
`docker compose up --build`.
