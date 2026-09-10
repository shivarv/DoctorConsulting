# Backend: FastAPI + psycopg.
#
# Two stages, one file. `dev` adds the test tooling and is what
# docker-compose builds; `prod` is last, so a plain `docker build .` — which
# is what Render and every other platform runs — gets the lean image.

FROM python:3.13-slim AS base

# No .pyc files to own the bind-mounted source, and unbuffered logs so
# `docker compose logs` shows output as it happens rather than in bursts.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copied on its own so a source edit doesn't invalidate the dependency layer.
# psycopg[binary] ships prebuilt wheels, so there is no libpq or compiler to
# install here.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src

EXPOSE 8000


# --- dev -------------------------------------------------------------------
# Adds pytest and httpx2 so `docker compose exec api python -m pytest` works.
# Stays root: a dev container gets shelled into and pip-installed in, and the
# bind-mounted source is the host's anyway.
FROM base AS dev

COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt

# docker-compose overrides this with --reload.
CMD ["sh", "-c", "exec uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}"]


# --- prod ------------------------------------------------------------------
# Last stage, so it is the default build target. No test tooling: pytest and
# an HTTP client in a deployed image are dead weight and extra CVE surface.
FROM base AS prod

# Drops root, so a compromise inside the container lands on an unprivileged
# account. After pip install, which needs to write to site-packages as root.
RUN useradd --create-home --uid 10001 appuser
USER appuser

# ${PORT} is injected by the host — Render, Fly and Cloud Run all assign one
# and route to it, so ignoring it means the platform's health check never
# reaches the app. `sh -c` is required for the expansion: the exec form does no
# substitution and would pass the literal string "${PORT}" to uvicorn. `exec`
# keeps uvicorn as PID 1 so SIGTERM reaches it directly and the lifespan
# shutdown in src/main.py gets a chance to close the connection pool.
#
# One worker on purpose. Each worker is a separate process with its own
# psycopg pool (max_size=10 in src/db/__init__.py), so N workers means N×10
# connections against a database that allows far fewer.
CMD ["sh", "-c", "exec uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
