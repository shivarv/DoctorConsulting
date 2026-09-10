"""Domain exceptions. Deliberately free of HTTP concepts — handlers map these."""


class DoctorNotFoundError(Exception):
    def __init__(self, doctor_id: str) -> None:
        super().__init__(f"No doctor found for id {doctor_id!r}")
        self.doctor_id = doctor_id
