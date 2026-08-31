"""Domain exceptions. Deliberately free of HTTP concepts — handlers map these."""


class BundleNotFoundError(Exception):
    def __init__(self, slug: str) -> None:
        super().__init__(f"No bundle found for slug {slug!r}")
        self.slug = slug
