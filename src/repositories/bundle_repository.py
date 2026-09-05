"""Bundles read from the videos directory on disk.

Each subdirectory of the videos directory is one bundle; its slug is the folder
name. Playable files inside are its videos, ordered by filename. This is the
only module that knows where bundle data physically lives, so it is the single
file to change when a real database replaces the filesystem.
"""

import re
from pathlib import Path
from urllib.parse import quote

from src.models.bundle import Bundle, Video

VIDEO_EXTENSIONS = frozenset({".mp4", ".webm", ".mov", ".m4v"})
COVER_NAMES = ("cover.jpg", "cover.jpeg", "cover.png", "cover.webp")

# Presentation copy for the known bundles. A folder with no entry here still
# shows up, titled from its folder name — so adding a bundle needs only a
# directory, and this table is an optional upgrade.
_BUNDLE_META: dict[str, tuple[str, str, str]] = {
    "morning-flow": (
        "Morning Flow",
        "Wake the body up with a gentle standing sequence.",
        "beginner",
    ),
    "stress-relief": (
        "Stress Relief & Breathwork",
        "Slow breathing and guided release for a busy head.",
        "all levels",
    ),
    "core-balance": (
        "Core & Balance",
        "Build stability through standing and seated holds.",
        "intermediate",
    ),
    "deep-stretch": (
        "Deep Stretch & Wind Down",
        "Long, quiet holds to close out the day.",
        "beginner",
    ),
}

_DEFAULT_LEVEL = "all levels"

_ORDER_PREFIX = re.compile(r"^\d+[-_.\s]+")
_DIGIT_RUN = re.compile(r"(\d+)")
_WORD_SEPARATORS = re.compile(r"[-_\s]+")


def _natural_key(name: str) -> list[tuple[int, int | str]]:
    """Sort key that orders embedded numbers numerically, so 9 precedes 10.

    Each part is tagged with its kind, so an int is never compared to a str.
    """
    parts = _DIGIT_RUN.split(name.lower())
    return [(0, int(part)) if part.isdigit() else (1, part) for part in parts]


def _titleize(raw: str) -> str:
    """`01-sun-salutation` -> `Sun Salutation`."""
    words = [word for word in _WORD_SEPARATORS.split(_ORDER_PREFIX.sub("", raw)) if word]
    return " ".join(word[:1].upper() + word[1:] for word in words) or raw


def _public_url(slug: str, filename: str) -> str:
    """Path the browser fetches the file from — served by Vite out of `public/`."""
    return f"/videos/{quote(slug)}/{quote(filename)}"


class BundleRepository:
    def __init__(self, videos_dir: Path) -> None:
        self._videos_dir = videos_dir

    def list_bundles(self) -> list[Bundle]:
        root = self._root()
        if root is None:
            return []
        folders = sorted(
            (path for path in root.iterdir() if path.is_dir() and not path.name.startswith(".")),
            key=lambda path: _natural_key(path.name),
        )
        return [self._build(folder, folder.name) for folder in folders]

    def get_by_slug(self, slug: str) -> Bundle | None:
        root = self._root()
        if root is None:
            return None
        folder = (root / slug).resolve()
        # Guards `..` segments and symlinks that would escape the videos
        # directory, since the slug arrives from a URL.
        if folder == root or not folder.is_relative_to(root) or not folder.is_dir():
            return None
        return self._build(folder, slug)

    def _root(self) -> Path | None:
        if not self._videos_dir.is_dir():
            return None
        return self._videos_dir.resolve()

    def _build(self, folder: Path, slug: str) -> Bundle:
        title, description, level = _BUNDLE_META.get(
            slug, (_titleize(slug), "", _DEFAULT_LEVEL)
        )
        return Bundle(
            slug=slug,
            title=title,
            description=description,
            level=level,
            thumbnail=self._find_cover(folder, slug),
            videos=self._scan_videos(folder, slug),
        )

    def _scan_videos(self, folder: Path, slug: str) -> tuple[Video, ...]:
        files = sorted(
            (path for path in folder.iterdir() if self._is_video(path)),
            key=lambda path: _natural_key(path.name),
        )
        return tuple(
            Video(
                id=f"{slug}/{path.name}",
                title=_titleize(path.stem),
                file=_public_url(slug, path.name),
                order=order,
            )
            for order, path in enumerate(files, start=1)
        )

    @staticmethod
    def _is_video(path: Path) -> bool:
        # Leading-dot names cover both dotfiles and macOS `._` resource forks.
        return (
            path.is_file()
            and not path.name.startswith(".")
            and path.suffix.lower() in VIDEO_EXTENSIONS
        )

    @staticmethod
    def _find_cover(folder: Path, slug: str) -> str | None:
        for name in COVER_NAMES:
            if (folder / name).is_file():
                return _public_url(slug, name)
        return None
