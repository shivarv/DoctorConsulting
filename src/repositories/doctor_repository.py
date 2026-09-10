"""Doctors, read from Postgres.

The only module that knows where doctor data physically lives. Everything
above it — service, handler, schemas — deals in `Doctor` objects and is
unaffected by the fact that these now come from a database rather than a
literal in this file.

Schema and seed data live in `db/`.
"""

from typing import Any

from psycopg_pool import ConnectionPool

from src.db import get_pool
from src.models.doctor import Doctor

# `specialities` is aggregated from the junction table rather than joined
# plainly, so a doctor stays one row instead of one row per condition.
# LEFT JOIN with the FILTER keeps a doctor who has no conditions recorded,
# rather than silently dropping them from the directory.
_SELECT = """
    SELECT
        d.id,
        d.name,
        d.title,
        d.location,
        d.bio,
        d.photo_url,
        d.experience_years,
        d.consultation_fee,
        d.rating,
        d.review_count,
        d.languages,
        d.available_days,
        COALESCE(
            array_agg(dc.condition_slug ORDER BY dc.condition_slug)
                FILTER (WHERE dc.condition_slug IS NOT NULL),
            ARRAY[]::TEXT[]
        ) AS specialities
    FROM doctors d
    LEFT JOIN doctor_conditions dc ON dc.doctor_id = d.id
    WHERE d.is_active
"""

_GROUP_AND_ORDER = """
    GROUP BY d.id
    ORDER BY d.name
"""


def _to_doctor(row: dict[str, Any]) -> Doctor:
    return Doctor(
        id=row["id"],
        name=row["name"],
        title=row["title"],
        # Tuples because `Doctor` is frozen and meant to be hashable; psycopg
        # hands back lists for TEXT[].
        specialities=tuple(row["specialities"]),
        location=row["location"],
        languages=tuple(row["languages"]),
        experience_years=row["experience_years"],
        photo_url=row["photo_url"],
        bio=row["bio"],
        consultation_fee=row["consultation_fee"],
        # NUMERIC arrives as Decimal; the API contract says float.
        rating=float(row["rating"]),
        review_count=row["review_count"],
        available_days=tuple(row["available_days"]),
    )


class DoctorRepository:
    def __init__(self, pool: ConnectionPool | None = None) -> None:
        # Defaults to the shared pool; injectable so a test can point at
        # another database without touching global state.
        self._pool = pool if pool is not None else get_pool()

    def list_all(self) -> list[Doctor]:
        with self._pool.connection() as conn:
            rows = conn.execute(_SELECT + _GROUP_AND_ORDER).fetchall()

        return [_to_doctor(row) for row in rows]

    def get_by_id(self, doctor_id: str) -> Doctor | None:
        with self._pool.connection() as conn:
            # Parameterised, never formatted into the string — `doctor_id`
            # comes from the URL.
            row = conn.execute(
                _SELECT + " AND d.id = %s" + _GROUP_AND_ORDER, (doctor_id,)
            ).fetchone()

        return _to_doctor(row) if row is not None else None
