---
name: project-overview
description: Orientation notes for the DoctorConsulting repo — what it does, how the FastAPI backend and React frontend fit together, where every feature lives, and how to run/test it. Read this FIRST when starting work in this repo, when asked "how does X work", "where is Y", "explain the project", or before touching an unfamiliar area of src/ or frontend/.
---

# DoctorConsulting — project map

An online-consultation site for an Ayurvedic practice in Coimbatore (3
clinics). FastAPI backend serving read-only JSON from Postgres, React +
TypeScript SPA on top. **No auth, and no writes anywhere** — booking is a
client-side wizard that never POSTs, so `users` and `appointments` are always
empty. Doctor records are still allopathic placeholder data; the user knows
and considers it sample content.

Last verified: 2026-09-09, branch `setup-postgress-backend`.

## Running it

```bash
# backend — from repo root, port 8000
.venv/bin/python -m uvicorn src.main:app --reload

# tests — 46 passing as of last check
.venv/bin/python -m pytest -q

# frontend — port 5173
cd frontend && npm run dev
npm run build   # tsc -b && vite build — the typecheck gate
npm run lint    # oxlint (not eslint)
```

Python 3.13 in `.venv/`. Backend deps in `requirements.txt` (FastAPI, uvicorn,
pydantic, python-dotenv, pytest, **httpx2** — plain httpx is deprecated for
Starlette's TestClient). Frontend is React 19 + React Router 7 + Vite 8, and
that is the *entire* dependency list — no state library, no data-fetching
library, no UI kit, no CSS framework. Don't reach for one.

## The three features

| Feature | Backend | Frontend | Data source |
|---|---|---|---|
| **Doctors** (directory + profiles) | `repositories/doctor_repository.py` | `features/doctors/` | Postgres |
| **Booking** (5-step wizard) | availability only, `services/doctor_service.py` | `features/booking/` | Derived, client-side |
| **About** | — | `pages/AboutPage.tsx` | Static copy |

The video-bundle feature ("Shop") was **deleted** on 2026-09-09 — repository,
service, handler, schemas, models, frontend feature, both pages, `utils/format.ts`
and 23 tests. `/shop` is now a `PlaceholderPage`. Don't resurrect it from git
history expecting it to be wanted. `frontend/public/videos/` still holds the
user's personal media, deliberately left in place (gitignored, irreplaceable).

### API surface (all GET, all under `/api`)

```
GET /health
GET /api/doctors                        → list[DoctorSummaryOut]
GET /api/doctors/{doctor_id}            → DoctorDetailOut (404 DoctorNotFoundError)
GET /api/doctors/{doctor_id}/availability → AvailabilityOut
```

CORS is GET-only, origins from `CORS_ORIGINS` (default `http://localhost:5173`).

## Backend: `src/`

Strict layering, one direction: **handler → service → repository**. Handlers own
HTTP (status codes, `HTTPException`), services own rules, repositories own where
data physically lives. `core/exceptions.py` is deliberately HTTP-free; handlers
translate domain errors into 404s.

- `models/` — frozen dataclasses (`Doctor`, `Bundle`, `Video`, `DaySlots`).
- `schemas/` — Pydantic response contracts + `to_summary`/`to_detail` mappers.
  Separate from models on purpose. Detail schemas *inherit* summary schemas and
  build via `**to_summary(x).model_dump()`.
- `core/conditions.py` — the canonical 12 condition slugs → labels. Doctors
  reference conditions by slug; labels are expanded server-side in
  `schemas/doctor.py` so the frontend never owns condition copy.
- `core/config.py` — `DATABASE_URL` and `CORS_ORIGINS` from env. `REPO_ROOT`
  is `parents[2]`, so `.env` loads the same whatever directory you launch from.
- `DoctorService` is injected via FastAPI `Depends` (`get_doctor_service`).

### Things that will surprise you

**Availability is synthesized, not stored.** `DoctorService.list_availability`
walks 4 weeks starting *tomorrow* (no same-day booking), keeps only the doctor's
`available_days`, and emits 7 fixed `CLINIC_TIMES`. Whether a slot is free comes
from `blake2b(doctor|date|time) % 3 != 0` — a hash, not randomness, so the grid
is stable across refreshes. `WEEKDAYS` is a hardcoded tuple indexed by
`date.weekday()` rather than `strftime("%a")`, which is locale-dependent.

**18 doctors, seeded not authored.** `db/seed_doctors.sql` loaded them; the
generating Python tuple is gone, so the database is the only source now.
Photos are randomuser.me placeholders.

## Frontend: `frontend/src/`

Feature-oriented: `app/` → `pages/` → `features/` → shared
(`components/`, `services/`, `types/`, `utils/`). Shared code never imports a
feature. Each feature owns its `components/ hooks/ services/ types.ts *.css`.

### Routes (`app/App.tsx`)

`/` redirects to `/about`. Real pages: `/about`, `/doctors`,
`/doctors/:doctorId`, `/book`. Placeholders: `/conditions`, `/shop`,
`/testimonials`, `/blog`.

### Patterns worth matching

**Data fetching is hand-rolled and consistent.** `services/apiClient.ts` has
`apiGet<T>` + an `ApiError` carrying a status (0 = never landed) and
`toApiError`. Aborts propagate untouched — they mean "no longer wanted", not an
error to render. Every feature service maps **snake_case wire → camelCase app**
in its own `*Api.ts`; that mapping is the only place the two casings meet.

**The hook shape is identical across `useDoctors`, `useDoctor`,
`useAvailability`** — copy it rather than inventing a new one:
`AbortController` in an effect, a single `Settled` state object, and
`loading`/`error` *derived during render*, never stored. The keyed hooks
(`useDoctor`, `useAvailability`) tag `Settled` with the id it
belongs to, so a stale result is simply "not current" and navigation reports
loading immediately — no state-resetting effect.

**Pages own loading/error/empty**, rendering `LoadingState` / `ErrorState` /
`EmptyState` from `components/`. Features render data.

**`useDoctorFilters` keeps filter state in the URL** (`?q=&condition=&location=`)
via `useSearchParams`, not React state — filters are shareable and
back-navigable. Conditions OR within the group; counts are *faceted* (each
group's counts reflect the other active filters). Typing uses
`{ replace: true }` so Back doesn't step per keystroke.

**Booking wizard** — `useBookingFlow` holds a `BookingDraft` and per-step
validation; `goTo` only moves backwards and never out of `done`. Arriving via
`/book?doctor=<id>` preselects and skips step one; an unknown id falls back to
null. `BookingPage` mounts the wizard only after doctors load and keys it on the
doctor id. Nothing is submitted anywhere — "Confirm booking" just advances.

**Styling is plain CSS**, one file per feature imported in `App.tsx`, BEM-ish
class names, design tokens as CSS custom properties in `index.css` with a
`prefers-color-scheme: dark` block. Use the tokens (`--accent`, `--space-4`,
`--radius`) — no inline styles, no CSS-in-JS.

## Database: `db/` — schema only, nothing reads it yet

Postgres 18 lives at `/Library/PostgreSQL/18` (not on PATH). Local database
`doctorconsulting` exists, loaded from `db/schema.sql` + `db/seed_doctors.sql`.
Six tables: `conditions`, `doctors`, `doctor_conditions`, `users`,
`appointments`, `testimonials`.

**Auth is asymmetric and catches people out.** `pg_hba.conf` is `trust` for the
Unix socket but `scram-sha-256` for TCP, so `psql -U postgres` needs no password
while `DATABASE_URL` (TCP via `@localhost`) does. Two roles: `postgres` for
schema work, `dc_app` (password in gitignored `.env`) for the app — it can
read/write rows but not alter the schema.

**Doctors come from Postgres; bundles still come from the filesystem.**
`DoctorRepository` queries these tables — the hardcoded `_DOCTORS` tuple is
gone, so `/api/doctors` fails without a reachable database. `BundleRepository`
is unchanged.

`src/db/__init__.py` is the only module importing psycopg: a lazily-opened
`ConnectionPool` built from `DATABASE_URL`, closed by the lifespan hook in
`main.py`. Lazy so importing the app never needs a database.

`doctors.id` is the slug, so the move changed no URLs. Doctors now sort by
name (the old tuple order is gone). Patient details sit on `appointments`, not
`users` (booker ≠ patient). Doctor tests run real SQL and **skip** when
Postgres is down. Full rationale in `db/README.md`.

## Docker: `docker-compose.yml` — dev stack, never run yet

Three services: `db` (postgres:18-alpine), `api`, `web`. Both app servers run
in reload mode with source bind-mounted, so it mirrors the native workflow
rather than replacing it.

**Docker is not installed on this machine** — the compose file and both
Dockerfiles are written and the SQL init order is verified, but no image has
ever been built. Treat it as untested until someone runs `docker compose up
--build`.

Two things that bite: the container publishes Postgres on **5433** because the
native install already holds 5432, and the DB init scripts in
`/docker-entrypoint-initdb.d/` run *only* on a virgin volume — schema edits
need `docker compose down -v`. Native and Docker coexist because compose sets
`DATABASE_URL` as a real env var and `load_dotenv` won't override those.

`db/roles.sql` (idempotent `dc_app` creation + grants) was extracted for this
and works locally too. Full notes in `DOCKER.md`.

## Tests: `tests/`

Mirrors `src/` (`api/ services/ repositories/`). **23 tests**, all doctor or
availability related, all hitting real Postgres — the `database` fixture in
`conftest.py` skips them when the server is down. Frontend has **no tests**;
`npm run build` is the only gate.

## Related skills

- `python-backend-dev` — backend conventions. **Its opening paragraph is stale**:
  it claims `requirements.txt` is empty and no framework is wired up, and cites
  `src/python_test_code.py`, which no longer exists. FastAPI is fully wired.
  The layering and style rules in it are still correct.
- `react-frontend-dev` — frontend conventions; accurate.
