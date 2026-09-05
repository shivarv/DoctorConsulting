from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class TimeSlot:
    time: str
    available: bool


@dataclass(frozen=True)
class DaySlots:
    date: date
    weekday: str
    slots: tuple[TimeSlot, ...]
