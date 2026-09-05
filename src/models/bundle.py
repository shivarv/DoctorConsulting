from dataclasses import dataclass


@dataclass(frozen=True)
class Video:
    id: str
    title: str
    file: str
    order: int


@dataclass(frozen=True)
class Bundle:
    slug: str
    title: str
    description: str
    level: str
    thumbnail: str | None
    videos: tuple[Video, ...]
