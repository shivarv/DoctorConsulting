"""Domain exceptions. Deliberately free of HTTP concepts — handlers map these."""


class BundleNotFoundError(Exception):
    def __init__(self, slug: str) -> None:
        super().__init__(f"No bundle found for slug {slug!r}")
        self.slug = slug


class DoctorNotFoundError(Exception):
    def __init__(self, doctor_id: str) -> None:
        super().__init__(f"No doctor found for id {doctor_id!r}")
        self.doctor_id = doctor_id
