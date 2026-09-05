from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path

from src.core.exceptions import DoctorNotFoundError
from src.repositories.doctor_repository import DoctorRepository
from src.schemas.doctor import (
    AvailabilityOut,
    DoctorDetailOut,
    DoctorSummaryOut,
    to_availability,
    to_detail,
    to_summary,
)
from src.services.doctor_service import DoctorService

router = APIRouter(prefix="/api/doctors", tags=["doctors"])

DOCTOR_ID_PATTERN = r"^[a-z0-9][a-z0-9-]*$"


def get_doctor_service() -> DoctorService:
    return DoctorService(DoctorRepository())


ServiceDep = Annotated[DoctorService, Depends(get_doctor_service)]
DoctorIdParam = Annotated[str, Path(pattern=DOCTOR_ID_PATTERN, examples=["anjali-menon"])]


@router.get("", response_model=list[DoctorSummaryOut])
def list_doctors(service: ServiceDep) -> list[DoctorSummaryOut]:
    return [to_summary(doctor) for doctor in service.list_doctors()]


@router.get("/{doctor_id}", response_model=DoctorDetailOut)
def get_doctor(doctor_id: DoctorIdParam, service: ServiceDep) -> DoctorDetailOut:
    try:
        return to_detail(service.get_doctor(doctor_id))
    except DoctorNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{doctor_id}/availability", response_model=AvailabilityOut)
def get_availability(doctor_id: DoctorIdParam, service: ServiceDep) -> AvailabilityOut:
    try:
        return to_availability(doctor_id, service.list_availability(doctor_id))
    except DoctorNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
