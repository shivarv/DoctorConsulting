"""API response contracts for doctors, kept separate from the domain models."""

from datetime import date

from pydantic import BaseModel

from src.core.conditions import label_for
from src.models.availability import DaySlots
from src.models.doctor import Doctor


class SpecialityOut(BaseModel):
    slug: str
    label: str


class DoctorSummaryOut(BaseModel):
    id: str
    name: str
    title: str
    specialities: list[SpecialityOut]
    location: str
    experience_years: int
    photo_url: str
    consultation_fee: int
    rating: float
    review_count: int


class DoctorDetailOut(DoctorSummaryOut):
    bio: str
    languages: list[str]
    available_days: list[str]


def _specialities(doctor: Doctor) -> list[SpecialityOut]:
    # Expanded server-side so the frontend never owns condition labels.
    return [SpecialityOut(slug=slug, label=label_for(slug)) for slug in doctor.specialities]


def to_summary(doctor: Doctor) -> DoctorSummaryOut:
    return DoctorSummaryOut(
        id=doctor.id,
        name=doctor.name,
        title=doctor.title,
        specialities=_specialities(doctor),
        location=doctor.location,
        experience_years=doctor.experience_years,
        photo_url=doctor.photo_url,
        consultation_fee=doctor.consultation_fee,
        rating=doctor.rating,
        review_count=doctor.review_count,
    )


def to_detail(doctor: Doctor) -> DoctorDetailOut:
    return DoctorDetailOut(
        **to_summary(doctor).model_dump(),
        bio=doctor.bio,
        languages=list(doctor.languages),
        available_days=list(doctor.available_days),
    )


class TimeSlotOut(BaseModel):
    time: str
    available: bool


class DaySlotsOut(BaseModel):
    date: date
    weekday: str
    slots: list[TimeSlotOut]


class AvailabilityOut(BaseModel):
    doctor_id: str
    days: list[DaySlotsOut]


def to_availability(doctor_id: str, days: list[DaySlots]) -> AvailabilityOut:
    return AvailabilityOut(
        doctor_id=doctor_id,
        days=[
            DaySlotsOut(
                date=day.date,
                weekday=day.weekday,
                slots=[TimeSlotOut(time=slot.time, available=slot.available) for slot in day.slots],
            )
            for day in days
        ],
    )
