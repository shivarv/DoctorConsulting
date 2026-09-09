# Backend: FastAPI + psycopg.
FROM python:3.13-slim

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

# Overridden with --reload by docker-compose for development.
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
