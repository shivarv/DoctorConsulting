from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from src.db import get_pool
from src.main import app
from src.repositories.doctor_repository import DoctorRepository


@pytest.fixture(scope="session")
def database() -> None:
    """Skip, rather than fail, when Postgres is not running.

    The doctor tests are real queries against a real database — that is the
    point of them — but a missing server is an environment problem, not a
    failing assertion, and should not look like one.
    """
    try:
        with get_pool().connection() as conn:
            conn.execute("SELECT 1")
    except Exception as exc:  # noqa: BLE001 — any failure to reach it will do
        pytest.skip(f"Postgres is not reachable: {exc}")


@pytest.fixture
def doctor_repository(database: None) -> DoctorRepository:
    return DoctorRepository()


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client
