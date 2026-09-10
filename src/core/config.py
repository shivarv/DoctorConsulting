"""Configuration read from the environment, with development-friendly defaults."""

import os
from pathlib import Path

from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parents[2]

load_dotenv(REPO_ROOT / ".env")

_DEFAULT_CORS_ORIGINS = "http://localhost:5173"


def _database_url() -> str:
    """Empty when unset — the failure is raised on first use, in `db`, so that
    importing the app without a database configured still works."""
    return os.environ.get("DATABASE_URL", "").strip()


def _cors_origins() -> list[str]:
    raw = os.environ.get("CORS_ORIGINS", _DEFAULT_CORS_ORIGINS)
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


CORS_ORIGINS = _cors_origins()
DATABASE_URL = _database_url()
