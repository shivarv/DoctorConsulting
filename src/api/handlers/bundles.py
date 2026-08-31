from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path

from src.core import config
from src.core.exceptions import BundleNotFoundError
from src.repositories.bundle_repository import BundleRepository
from src.schemas.bundle import BundleDetailOut, BundleSummaryOut, to_detail, to_summary
from src.services.bundle_service import BundleService

router = APIRouter(prefix="/api/bundles", tags=["bundles"])

SLUG_PATTERN = r"^[a-z0-9][a-z0-9-]*$"


def get_bundle_service() -> BundleService:
    return BundleService(BundleRepository(config.VIDEOS_DIR))


ServiceDep = Annotated[BundleService, Depends(get_bundle_service)]
SlugParam = Annotated[str, Path(pattern=SLUG_PATTERN, examples=["morning-flow"])]


@router.get("", response_model=list[BundleSummaryOut])
def list_bundles(service: ServiceDep) -> list[BundleSummaryOut]:
    return [to_summary(bundle) for bundle in service.list_bundles()]


@router.get("/{slug}", response_model=BundleDetailOut)
def get_bundle(slug: SlugParam, service: ServiceDep) -> BundleDetailOut:
    try:
        return to_detail(service.get_bundle(slug))
    except BundleNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
