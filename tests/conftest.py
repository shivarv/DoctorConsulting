from collections.abc import Callable, Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from src.api.handlers.bundles import get_bundle_service
from src.main import app
from src.repositories.bundle_repository import BundleRepository
from src.services.bundle_service import BundleService

MakeBundle = Callable[..., Path]


@pytest.fixture
def videos_dir(tmp_path: Path) -> Path:
    """A videos directory that does not exist yet — create folders per test."""
    return tmp_path / "videos"


@pytest.fixture
def make_bundle(videos_dir: Path) -> MakeBundle:
    def _make(slug: str, *filenames: str) -> Path:
        folder = videos_dir / slug
        folder.mkdir(parents=True, exist_ok=True)
        for name in filenames:
            (folder / name).write_bytes(b"")
        return folder

    return _make


@pytest.fixture
def repository(videos_dir: Path) -> BundleRepository:
    return BundleRepository(videos_dir)


@pytest.fixture
def service(repository: BundleRepository) -> BundleService:
    return BundleService(repository)


@pytest.fixture
def client(service: BundleService) -> Iterator[TestClient]:
    app.dependency_overrides[get_bundle_service] = lambda: service
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
