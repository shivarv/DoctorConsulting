from pathlib import Path

from src.repositories.bundle_repository import BundleRepository
from tests.conftest import MakeBundle


def test_missing_videos_dir_yields_no_bundles(repository: BundleRepository) -> None:
    assert repository.list_bundles() == []
    assert repository.get_by_slug("morning-flow") is None


def test_empty_folder_is_a_bundle_with_no_videos(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow")

    bundle = repository.get_by_slug("morning-flow")

    assert bundle is not None
    assert bundle.videos == ()


def test_known_slug_uses_curated_metadata(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-sun-salutation.mp4")

    bundle = repository.get_by_slug("morning-flow")

    assert bundle is not None
    assert bundle.title == "Morning Flow"
    assert bundle.level == "beginner"
    assert bundle.description


def test_unknown_slug_derives_title_from_folder_name(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle("hip-openers", "01-figure-four.mp4")

    bundle = repository.get_by_slug("hip-openers")

    assert bundle is not None
    assert bundle.title == "Hip Openers"
    assert bundle.level == "all levels"


def test_videos_sort_numerically_not_lexicographically(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "10-tenth.mp4", "9-ninth.mp4", "2-second.mp4")

    bundle = repository.get_by_slug("morning-flow")

    assert bundle is not None
    assert [video.title for video in bundle.videos] == ["Second", "Ninth", "Tenth"]
    assert [video.order for video in bundle.videos] == [1, 2, 3]


def test_non_video_files_are_ignored(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle(
        "morning-flow",
        "01-flow.mp4",
        "02-flow.webm",
        "cover.jpg",
        "notes.txt",
        ".DS_Store",
        "._01-flow.mp4",
    )

    bundle = repository.get_by_slug("morning-flow")

    assert bundle is not None
    assert [video.id for video in bundle.videos] == [
        "morning-flow/01-flow.mp4",
        "morning-flow/02-flow.webm",
    ]


def test_titles_strip_order_prefix_and_separators(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle(
        "hip-openers",
        "01-sun-salutation.mp4",
        "02_standing_flow.mp4",
        "03. deep twist.mp4",
        "closing.mp4",
    )

    bundle = repository.get_by_slug("hip-openers")

    assert bundle is not None
    assert [video.title for video in bundle.videos] == [
        "Sun Salutation",
        "Standing Flow",
        "Deep Twist",
        "Closing",
    ]


def test_file_url_is_frontend_relative_and_escaped(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01 sun salutation.mp4")

    bundle = repository.get_by_slug("morning-flow")

    assert bundle is not None
    assert bundle.videos[0].file == "/videos/morning-flow/01%20sun%20salutation.mp4"


def test_cover_image_becomes_the_thumbnail(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-flow.mp4", "cover.png")

    bundle = repository.get_by_slug("morning-flow")

    assert bundle is not None
    assert bundle.thumbnail == "/videos/morning-flow/cover.png"


def test_thumbnail_is_none_without_a_cover(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-flow.mp4")

    bundle = repository.get_by_slug("morning-flow")

    assert bundle is not None
    assert bundle.thumbnail is None


def test_list_bundles_returns_every_folder(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-flow.mp4")
    make_bundle("deep-stretch")
    make_bundle(".hidden")

    slugs = [bundle.slug for bundle in repository.list_bundles()]

    assert slugs == ["deep-stretch", "morning-flow"]


def test_traversal_slugs_are_rejected(
    repository: BundleRepository, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-flow.mp4")

    for slug in ("../../etc", "..", ".", "", "morning-flow/../..", "/etc"):
        assert repository.get_by_slug(slug) is None, slug


def test_symlink_escaping_the_videos_dir_is_rejected(
    videos_dir: Path, tmp_path: Path, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-flow.mp4")
    outside = tmp_path / "outside"
    outside.mkdir()
    (outside / "secret.mp4").write_bytes(b"")
    (videos_dir / "escape").symlink_to(outside, target_is_directory=True)

    assert BundleRepository(videos_dir).get_by_slug("escape") is None
