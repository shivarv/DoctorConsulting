import re

import pytest

from src.core.conditions import CONDITIONS
from src.models.doctor import Doctor
from src.repositories.doctor_repository import DoctorRepository

ID_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]*$")


@pytest.fixture
def doctors() -> list[Doctor]:
    return DoctorRepository().list_all()


def test_repository_is_not_empty(doctors: list[Doctor]) -> None:
    assert len(doctors) >= 10


def test_ids_are_unique_and_url_safe(doctors: list[Doctor]) -> None:
    ids = [doctor.id for doctor in doctors]

    assert len(ids) == len(set(ids))
    for doctor_id in ids:
        assert ID_PATTERN.match(doctor_id), doctor_id


def test_every_speciality_is_a_known_condition(doctors: list[Doctor]) -> None:
    """A typo here would produce a doctor no filter can ever match."""
    for doctor in doctors:
        assert doctor.specialities, doctor.id
        for slug in doctor.specialities:
            assert slug in CONDITIONS, f"{doctor.id} has unknown speciality {slug!r}"


def test_every_condition_has_at_least_one_doctor(doctors: list[Doctor]) -> None:
    """Otherwise the sidebar would offer a filter that returns nothing."""
    covered = {slug for doctor in doctors for slug in doctor.specialities}

    assert covered == set(CONDITIONS), f"uncovered: {set(CONDITIONS) - covered}"


def test_every_doctor_has_a_photo_and_location(doctors: list[Doctor]) -> None:
    for doctor in doctors:
        assert doctor.photo_url.startswith("https://"), doctor.id
        assert doctor.location, doctor.id
        assert doctor.languages, doctor.id
        assert doctor.available_days, doctor.id


def test_get_by_id_finds_and_misses(doctors: list[Doctor]) -> None:
    repository = DoctorRepository()

    assert repository.get_by_id(doctors[0].id) == doctors[0]
    assert repository.get_by_id("no-such-doctor") is None
