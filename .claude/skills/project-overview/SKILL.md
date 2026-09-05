---
name: project-overview
description: Orientation notes for the DoctorConsulting repo — what it does, how the FastAPI backend and React frontend fit together, where every feature lives, and how to run/test it. Read this FIRST when starting work in this repo, when asked "how does X work", "where is Y", "explain the project", or before touching an unfamiliar area of src/ or frontend/.
---

# DoctorConsulting — project map

A doctor-consultation site. FastAPI backend serving read-only JSON, React +
TypeScript SPA on top. **No database, no auth, no writes anywhere** — doctor
data is hardcoded in Python, bundle data is scanned off the filesystem, and
booking is a client-side wizard that never POSTs. Keep that in mind before
looking for a persistence layer that doesn't exist.

Last verified: 2026-09-05, branch `feature/show-video-bundles`.

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
| **Bundles** (video courses, "Shop") | `repositories/bundle_repository.py` | `features/bundles/` | Filesystem scan |
| **Doctors** (directory + profiles) | `repositories/doctor_repository.py` | `features/doctors/` | Hardcoded tuple |
| **Booking** (5-step wizard) | availability only, `services/doctor_service.py` | `features/booking/` | Derived, client-side |

### API surface (all GET, all under `/api`)

```
GET /health
GET /api/bundles                        → list[BundleSummaryOut]
GET /api/bundles/{slug}                 → BundleDetailOut (404 BundleNotFoundError)
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
- `core/config.py` — `VIDEOS_DIR` and `CORS_ORIGINS` from env, resolved against
  the repo root (not cwd) so launch directory doesn't matter.
- Services are injected via FastAPI `Depends` (`get_bundle_service`,
  `get_doctor_service`) — that's the seam tests override.

### Things that will surprise you

**Bundles come from the filesystem.** `BundleRepository` scans
`frontend/public/videos/`: each subfolder is a bundle, folder name *is* the
slug, playable files inside (`.mp4 .webm .mov .m4v`) are its videos. Adding a
bundle = creating a folder; no restart, no code change. Titles are derived from
filenames (`01-sun-salutation.mp4` → "Sun Salutation") by stripping the order
prefix. `_natural_key` sorts embedded numbers numerically so `10-` follows `9-`,
and tags each part with its kind so int never compares to str. `_BUNDLE_META` is
an *optional* table of nicer title/description/level for the four known slugs.
`cover.jpg|jpeg|png|webp` becomes the thumbnail. `get_by_slug` resolves and
checks `is_relative_to(root)` — path-traversal guard, since the slug is from a
URL. Full authoring guide: `frontend/public/videos/README.md`.

**Availability is synthesized, not stored.** `DoctorService.list_availability`
walks 4 weeks starting *tomorrow* (no same-day booking), keeps only the doctor's
`available_days`, and emits 7 fixed `CLINIC_TIMES`. Whether a slot is free comes
from `blake2b(doctor|date|time) % 3 != 0` — a hash, not randomness, so the grid
is stable across refreshes. `WEEKDAYS` is a hardcoded tuple indexed by
`date.weekday()` rather than `strftime("%a")`, which is locale-dependent.

**Doctors are 19 hardcoded records** in `doctor_repository.py` with prose bios
and randomuser.me placeholder photos. This is the file to replace when a DB
arrives, and the only one.

## Frontend: `frontend/src/`

Feature-oriented: `app/` → `pages/` → `features/` → shared
(`components/`, `services/`, `types/`, `utils/`). Shared code never imports a
feature. Each feature owns its `components/ hooks/ services/ types.ts *.css`.

### Routes (`app/App.tsx`)

`/` redirects to `/about`. Real pages: `/doctors`, `/doctors/:doctorId`,
`/shop`, `/shop/:slug`, `/book`. Placeholders: `/about`, `/conditions`,
`/testimonials`, `/blog`. `/bundles` and `/bundles/:slug` are legacy redirects
into `/shop` — bundles moved, keep the old URLs alive.

### Patterns worth matching

**Data fetching is hand-rolled and consistent.** `services/apiClient.ts` has
`apiGet<T>` + an `ApiError` carrying a status (0 = never landed) and
`toApiError`. Aborts propagate untouched — they mean "no longer wanted", not an
error to render. Every feature service maps **snake_case wire → camelCase app**
in its own `*Api.ts`; that mapping is the only place the two casings meet.

**The hook shape is identical across `useBundles`, `useBundle`, `useDoctors`,
`useDoctor`, `useAvailability`** — copy it rather than inventing a new one:
`AbortController` in an effect, a single `Settled` state object, and
`loading`/`error` *derived during render*, never stored. The keyed hooks
(`useBundle`, `useDoctor`, `useAvailability`) tag `Settled` with the slug/id it
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

## Tests: `tests/`

Mirrors `src/` (`api/ services/ repositories/`). `conftest.py` builds real
bundle folders in `tmp_path` via the `make_bundle` fixture and injects the
service through `app.dependency_overrides[get_bundle_service]` — no mocking of
the filesystem. Frontend has **no tests**; `npm run build` is the only gate.

## Related skills

- `python-backend-dev` — backend conventions. **Its opening paragraph is stale**:
  it claims `requirements.txt` is empty and no framework is wired up, and cites
  `src/python_test_code.py`, which no longer exists. FastAPI is fully wired.
  The layering and style rules in it are still correct.
- `react-frontend-dev` — frontend conventions; accurate.
