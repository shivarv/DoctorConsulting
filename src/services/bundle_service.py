from src.core.exceptions import BundleNotFoundError
from src.models.bundle import Bundle
from src.repositories.bundle_repository import BundleRepository


class BundleService:
    def __init__(self, repository: BundleRepository) -> None:
        self._repository = repository

    def list_bundles(self) -> list[Bundle]:
        return self._repository.list_bundles()

    def get_bundle(self, slug: str) -> Bundle:
        bundle = self._repository.get_by_slug(slug)
        if bundle is None:
            raise BundleNotFoundError(slug)
        return bundle
