---
name: python-backend-dev
description: Use whenever writing, reviewing, or structuring Python backend logic in this repo — API endpoints, services, database access, business logic, or scripts under src/. Triggers on "add an endpoint", "write a service", "backend logic", "database model", "add a route", or any new file under src/.
---

# Python backend development (DoctorConsulting)

Conventions for backend Python code in this repo. Repo currently has no web
framework wired up yet (`requirements.txt` is empty) — confirm what's
actually installed with `pip freeze` or by reading `requirements.txt` before
assuming Flask/FastAPI/Django patterns apply.

## Project layout

Layered architecture. Dependencies flow one way only:
`Handler -> Service -> Repository -> Database`.

```
src/
├── api/handlers/   # routes; request/response only — thin, no business logic, no DB access
├── services/       # business logic & orchestration — no HTTP concepts, no raw SQL
├── repositories/   # DB queries/persistence — no business rules
├── models/         # domain / ORM entities
├── schemas/        # API request/response contracts — kept separate from DB models
├── core/           # shared config, exceptions, cross-cutting utilities (not a dumping ground)
└── db/             # connections/sessions; reads config from env, no hardcoded credentials
tests/              # mirrors src/ structure
```

- Handlers call services; services call repositories; repositories use `db/`.
  Never skip or reverse a layer (e.g. handler querying the DB directly,
  service containing HTTP status codes, repository containing business
  rules).
- New top-level packages need an `__init__.py` (see existing `src/__init__.py`,
  `tests/__init__.py`).
- Secrets and config go in `.env` (already gitignored) and are read via
  `os.environ` / `python-dotenv` — never hardcode credentials or commit them.
- Keep the architecture proportional to the feature — don't create empty
  layers, interfaces, or factories without a concrete second use case.

## Before writing code

1. Check `requirements.txt` for the actual dependency set — don't introduce a
   new framework or library without checking if an equivalent is already
   used.
2. If adding a dependency, add it to `requirements.txt` with a pinned or
   minimum version.
3. Look for an existing module doing something similar before creating a new
   pattern (e.g. how errors are raised, how config is loaded).

## Code style

- Type hints on function signatures (params + return type).
- No docstrings unless the function's *why* isn't obvious from its name/code
  — this repo currently uses short module/function docstrings sparingly
  (see `src/python_test_code.py`), keep that style rather than verbose
  multi-paragraph docstrings.
- Validate/handle errors at system boundaries (API input, external calls,
  file/DB I/O) — don't wrap internal function calls in defensive
  try/except for conditions that can't occur.
- Prefer explicit, small functions over deep abstractions; this is an early
  -stage project — don't build framework-like scaffolding (plugin systems,
  generic base classes) before there's a second concrete use case.

## Testing

- Every new function with logic (branching, parsing, calculations) gets a
  `pytest` test in the matching `tests/` file.
- Run tests with `pytest` from the repo root before considering a change
  done.
- Test business logic directly; don't mock things that don't need mocking
  (e.g. pure functions).

## Database / external services (once introduced)

- All DB access goes through `repositories/`, using sessions/connections
  from `db/` — never import a DB driver directly in `services/` or
  `api/handlers/`.
- Never build SQL via string formatting/f-strings — use parameterized
  queries or the ORM's query builder to avoid SQL injection.
- Read connection strings/API keys from environment variables, not literals.

## Definition of done

- [ ] Code runs (`python -m src.<module>` or via tests)
- [ ] `pytest` passes
- [ ] New dependencies added to `requirements.txt`
- [ ] No secrets/credentials committed
- [ ] Tests added for new logic
