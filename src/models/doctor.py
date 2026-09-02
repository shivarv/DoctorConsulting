from dataclasses import dataclass


@dataclass(frozen=True)
class Doctor:
    id: str
    name: str
    title: str
    # Condition slugs from `core.conditions` — the doctor↔condition mapping.
    specialities: tuple[str, ...]
    location: str
    languages: tuple[str, ...]
    experience_years: int
    photo_url: str
    bio: str
    consultation_fee: int
    rating: float
    review_count: int
    available_days: tuple[str, ...]
