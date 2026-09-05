from datetime import date, timedelta
from hashlib import blake2b

from src.core.exceptions import DoctorNotFoundError
from src.models.availability import DaySlots, TimeSlot
from src.models.doctor import Doctor
from src.repositories.doctor_repository import DoctorRepository

# Indexed by date.weekday(). Deliberately not strftime("%a"), which is
# locale-dependent and would match nothing on a non-English machine.
WEEKDAYS = ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")

CLINIC_TIMES = ("09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00")

DEFAULT_WEEKS = 4


def _is_slot_free(doctor_id: str, day: date, time: str) -> bool:
    """Roughly a third of slots are already taken.

    Derived from a hash rather than randomness so the same request always gives
    the same answer — otherwise the grid would reshuffle on every refresh.
    """
    digest = blake2b(f"{doctor_id}|{day.isoformat()}|{time}".encode(), digest_size=2).digest()
    return int.from_bytes(digest, "big") % 3 != 0


class DoctorService:
    def __init__(self, repository: DoctorRepository) -> None:
        self._repository = repository

    def list_doctors(self) -> list[Doctor]:
        return self._repository.list_all()

    def get_doctor(self, doctor_id: str) -> Doctor:
        doctor = self._repository.get_by_id(doctor_id)
        if doctor is None:
            raise DoctorNotFoundError(doctor_id)
        return doctor

    def list_availability(
        self,
        doctor_id: str,
        today: date | None = None,
        weeks: int = DEFAULT_WEEKS,
    ) -> list[DaySlots]:
        doctor = self.get_doctor(doctor_id)
        start = today if today is not None else date.today()

        days: list[DaySlots] = []
        # From tomorrow — same-day booking isn't offered.
        for offset in range(1, weeks * 7 + 1):
            day = start + timedelta(days=offset)
            weekday = WEEKDAYS[day.weekday()]
            if weekday not in doctor.available_days:
                continue
            days.append(
                DaySlots(
                    date=day,
                    weekday=weekday,
                    slots=tuple(
                        TimeSlot(time=time, available=_is_slot_free(doctor.id, day, time))
                        for time in CLINIC_TIMES
                    ),
                )
            )
        return days
