"""Configuration read from the environment, with development-friendly defaults."""

import os
from pathlib import Path

from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parents[2]

load_dotenv(REPO_ROOT / ".env")

_DEFAULT_VIDEOS_DIR = REPO_ROOT / "frontend" / "public" / "videos"
_DEFAULT_CORS_ORIGINS = "http://localhost:5173"


def _videos_dir() -> Path:
    raw = os.environ.get("VIDEOS_DIR", "").strip()
    if not raw:
        return _DEFAULT_VIDEOS_DIR
    path = Path(raw).expanduser()
    # Relative overrides are resolved against the repo root, not the cwd, so the
    # server behaves the same whichever directory it is launched from.
    return path if path.is_absolute() else REPO_ROOT / path


def _cors_origins() -> list[str]:
    raw = os.environ.get("CORS_ORIGINS", _DEFAULT_CORS_ORIGINS)
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


VIDEOS_DIR = _videos_dir()
CORS_ORIGINS = _cors_origins()
