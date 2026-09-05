from datetime import date

import pytest

from src.core.exceptions import DoctorNotFoundError
from src.repositories.doctor_repository import DoctorRepository
from src.services.doctor_service import CLINIC_TIMES, DoctorService

# Fixed so the suite doesn't depend on the day it runs. A Tuesday.
TODAY = date(2026, 9, 1)


@pytest.fixture
def service() -> DoctorService:
    return DoctorService(DoctorRepository())


def test_list_doctors_returns_all(service: DoctorService) -> None:
    assert len(service.list_doctors()) >= 10


def test_get_doctor_returns_the_right_one(service: DoctorService) -> None:
    doctor = service.get_doctor("anjali-menon")

    assert doctor.name == "Dr. Anjali Menon"
    assert "diabetes" in doctor.specialities


def test_get_doctor_raises_for_unknown_id(service: DoctorService) -> None:
    with pytest.raises(DoctorNotFoundError) as excinfo:
        service.get_doctor("no-such-doctor")

    assert excinfo.value.doctor_id == "no-such-doctor"


def test_availability_only_offers_the_doctors_weekdays(service: DoctorService) -> None:
    doctor = service.get_doctor("anjali-menon")  # Mon, Tue, Thu, Fri
    days = service.list_availability("anjali-menon", today=TODAY)

    offered = {day.weekday for day in days}
    assert offered == set(doctor.available_days)
    assert "Wed" not in offered
    assert "Sat" not in offered


def test_availability_starts_tomorrow_and_stays_in_window(service: DoctorService) -> None:
    days = service.list_availability("anjali-menon", today=TODAY, weeks=4)

    assert days, "expected at least one bookable day"
    for day in days:
        assert day.date > TODAY, "same-day booking should not be offered"
        assert (day.date - TODAY).days <= 28


def test_every_offered_day_has_the_full_slot_template(service: DoctorService) -> None:
    days = service.list_availability("anjali-menon", today=TODAY)

    for day in days:
        assert tuple(slot.time for slot in day.slots) == CLINIC_TIMES


def test_some_slots_are_taken_so_the_ui_has_a_disabled_state(service: DoctorService) -> None:
    days = service.list_availability("anjali-menon", today=TODAY)
    all_slots = [slot for day in days for slot in day.slots]

    assert any(slot.available for slot in all_slots)
    assert any(not slot.available for slot in all_slots)


def test_availability_is_deterministic(service: DoctorService) -> None:
    """Otherwise the slot grid would reshuffle on every page refresh."""
    first = service.list_availability("anjali-menon", today=TODAY)
    second = service.list_availability("anjali-menon", today=TODAY)

    assert first == second


def test_availability_raises_for_unknown_doctor(service: DoctorService) -> None:
    with pytest.raises(DoctorNotFoundError):
        service.list_availability("no-such-doctor", today=TODAY)
