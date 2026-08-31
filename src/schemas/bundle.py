"""API response contracts, kept separate from the domain models in `models/`."""

from pydantic import BaseModel

from src.models.bundle import Bundle, Video


class VideoOut(BaseModel):
    id: str
    title: str
    file: str
    order: int


class BundleSummaryOut(BaseModel):
    slug: str
    title: str
    description: str
    level: str
    thumbnail: str | None
    video_count: int


class BundleDetailOut(BundleSummaryOut):
    videos: list[VideoOut]


def to_video(video: Video) -> VideoOut:
    return VideoOut(id=video.id, title=video.title, file=video.file, order=video.order)


def to_summary(bundle: Bundle) -> BundleSummaryOut:
    return BundleSummaryOut(
        slug=bundle.slug,
        title=bundle.title,
        description=bundle.description,
        level=bundle.level,
        thumbnail=bundle.thumbnail,
        video_count=len(bundle.videos),
    )


def to_detail(bundle: Bundle) -> BundleDetailOut:
    return BundleDetailOut(
        **to_summary(bundle).model_dump(),
        videos=[to_video(video) for video in bundle.videos],
    )
