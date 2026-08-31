import pytest

from src.core.exceptions import BundleNotFoundError
from src.services.bundle_service import BundleService
from tests.conftest import MakeBundle


def test_get_bundle_returns_videos_in_order(
    service: BundleService, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-warm-up.mp4", "02-standing-flow.mp4")

    bundle = service.get_bundle("morning-flow")

    assert [video.order for video in bundle.videos] == [1, 2]


def test_get_bundle_raises_for_unknown_slug(
    service: BundleService, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-warm-up.mp4")

    with pytest.raises(BundleNotFoundError) as excinfo:
        service.get_bundle("does-not-exist")

    assert excinfo.value.slug == "does-not-exist"


def test_list_bundles_is_empty_when_nothing_on_disk(service: BundleService) -> None:
    assert service.list_bundles() == []
