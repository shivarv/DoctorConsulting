-- DoctorConsulting — table definitions.
--
-- Run against an empty database:
--     psql -d doctorconsulting -f db/schema.sql
--
-- Safe to re-run: every statement is guarded. It will not, however, alter a
-- table that already exists — to pick up a change here, drop the database and
-- recreate it (see db/README.md).

BEGIN;

-- Conditions -------------------------------------------------------------
-- The canonical list a doctor can treat. Mirrors src/core/conditions.py; the
-- slug is the stable identifier used in URLs and filters, the label is display
-- only. Seeded by db/seed_doctors.sql.

CREATE TABLE IF NOT EXISTS conditions (
    slug  TEXT PRIMARY KEY,
    label TEXT NOT NULL
);

-- Doctors ----------------------------------------------------------------
-- The primary key is the slug ('anjali-menon'), not a generated number,
-- because it is already the public identifier in /api/doctors/{doctor_id}.
-- Keeping it means the switch to Postgres does not change a single URL.

CREATE TABLE IF NOT EXISTS doctors (
    id                TEXT PRIMARY KEY,
    name              TEXT    NOT NULL,
    title             TEXT    NOT NULL,
    location          TEXT    NOT NULL,
    bio               TEXT    NOT NULL DEFAULT '',
    photo_url         TEXT    NOT NULL,
    experience_years  INTEGER NOT NULL CHECK (experience_years >= 0),
    consultation_fee  INTEGER NOT NULL CHECK (consultation_fee >= 0),

    -- Plain lists with no identity of their own, so they stay as arrays rather
    -- than earning a table each. Conditions are different — they are a shared,
    -- referenced set, so they get a junction below.
    languages         TEXT[]  NOT NULL DEFAULT '{}',
    available_days    TEXT[]  NOT NULL DEFAULT '{}',

    -- Denormalised summary of the testimonials. Kept as columns because the
    -- doctor list reads them on every request and they change rarely; refresh
    -- them when a testimonial lands rather than aggregating per query.
    rating            NUMERIC(2, 1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count      INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),

    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Which doctor treats which condition. Many-to-many both ways: a doctor has
-- several specialities, a condition has several doctors.
CREATE TABLE IF NOT EXISTS doctor_conditions (
    doctor_id      TEXT NOT NULL REFERENCES doctors (id)    ON DELETE CASCADE,
    condition_slug TEXT NOT NULL REFERENCES conditions (slug) ON DELETE RESTRICT,
    PRIMARY KEY (doctor_id, condition_slug)
);

-- Filtering the directory by condition is the single most common query.
CREATE INDEX IF NOT EXISTS doctor_conditions_condition_idx
    ON doctor_conditions (condition_slug);

CREATE INDEX IF NOT EXISTS doctors_location_idx ON doctors (location);

-- Users ------------------------------------------------------------------
-- Created the first time someone completes the booking form, from the mobile
-- and email they enter. There is no password: an appointment is the only
-- thing that brings a row into being, so treat email/mobile as the identity
-- until real accounts exist.

CREATE TABLE IF NOT EXISTS users (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name  TEXT NOT NULL,
    email      TEXT NOT NULL,
    mobile     TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Case-insensitive uniqueness without needing the citext extension. These are
-- what an upsert keys on when a returning patient books again.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key  ON users (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS users_mobile_key ON users (mobile);

-- Appointments -----------------------------------------------------------
-- One booked consultation. The patient fields are stored per appointment, not
-- on the user, because the person booking is often not the person being seen
-- — a parent booking for a child, say — and their age and reason differ visit
-- to visit.

CREATE TABLE IF NOT EXISTS appointments (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id          BIGINT NOT NULL REFERENCES users (id)   ON DELETE RESTRICT,
    doctor_id        TEXT   NOT NULL REFERENCES doctors (id) ON DELETE RESTRICT,

    scheduled_on     DATE NOT NULL,
    scheduled_at     TIME NOT NULL,

    patient_name     TEXT     NOT NULL,
    patient_age      SMALLINT NOT NULL CHECK (patient_age BETWEEN 0 AND 120),
    patient_gender   TEXT     NOT NULL,
    reason           TEXT     NOT NULL,

    -- Snapshot of what was charged. The doctor's fee may change later; an
    -- appointment must still remember what it actually cost.
    consultation_fee INTEGER NOT NULL CHECK (consultation_fee >= 0),

    status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),

    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A doctor cannot be in two consultations at once. Cancelled slots are
-- excluded so the time is genuinely released and can be rebooked.
CREATE UNIQUE INDEX IF NOT EXISTS appointments_slot_key
    ON appointments (doctor_id, scheduled_on, scheduled_at)
    WHERE status <> 'cancelled';

CREATE INDEX IF NOT EXISTS appointments_user_idx   ON appointments (user_id);
CREATE INDEX IF NOT EXISTS appointments_doctor_idx ON appointments (doctor_id, scheduled_on);

-- Testimonials -----------------------------------------------------------
-- The user↔doctor junction: who reviewed whom, with the rating that feeds the
-- doctor's score.

CREATE TABLE IF NOT EXISTS testimonials (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users (id)   ON DELETE CASCADE,
    doctor_id      TEXT   NOT NULL REFERENCES doctors (id) ON DELETE CASCADE,

    -- Which visit this is about. Nullable so a testimonial can survive an
    -- appointment being purged, and unique so one visit yields one review.
    appointment_id BIGINT REFERENCES appointments (id) ON DELETE SET NULL,

    rating         SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    body           TEXT NOT NULL DEFAULT '',

    -- Reviews are held back until someone has read them.
    is_published   BOOLEAN NOT NULL DEFAULT FALSE,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One opinion per patient per doctor; editing it updates the same row.
CREATE UNIQUE INDEX IF NOT EXISTS testimonials_user_doctor_key
    ON testimonials (user_id, doctor_id);

CREATE UNIQUE INDEX IF NOT EXISTS testimonials_appointment_key
    ON testimonials (appointment_id)
    WHERE appointment_id IS NOT NULL;

-- The doctor profile lists published reviews, newest first.
CREATE INDEX IF NOT EXISTS testimonials_doctor_idx
    ON testimonials (doctor_id, created_at DESC)
    WHERE is_published;

COMMIT;
