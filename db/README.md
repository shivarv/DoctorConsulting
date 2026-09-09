# Database

Postgres schema and reference data for DoctorConsulting. **The API reads
doctors from here** — `DoctorRepository` queries these tables, so the server
will not serve `/api/doctors` without a reachable database.

Bundles are still scanned off the filesystem; only doctors moved.

```
db/
├── schema.sql        # every table, index and constraint
└── seed_doctors.sql  # the 12 conditions and 18 doctors, generated from the Python source
```

## One-time setup

Postgres 18 is installed at `/Library/PostgreSQL/18`. Its `bin` is not on the
default PATH, so either add it:

```bash
export PATH="/Library/PostgreSQL/18/bin:$PATH"
```

or prefix the commands below with that path.

**1. Set up auth.** See "Authentication" below — the short version is that
`psql -U postgres` needs no password, but the app does. Copy `.env.example` to
`.env` if you don't have one. `.env` is gitignored.

**2. Create the database.**

```bash
createdb -U postgres doctorconsulting
```

**3. Create the tables, then load the reference data.**

```bash
psql -U postgres -d doctorconsulting -f db/schema.sql
psql -U postgres -d doctorconsulting -f db/seed_doctors.sql
```

Both are safe to re-run. `schema.sql` skips anything that already exists;
`seed_doctors.sql` upserts, so re-running it overwrites the doctor rows with
whatever the files currently say.

## Starting over

`schema.sql` will not alter a table that already exists, so a change to a
column needs a clean database:

```bash
dropdb -U postgres doctorconsulting && createdb -U postgres doctorconsulting
psql -U postgres -d doctorconsulting -f db/schema.sql
psql -U postgres -d doctorconsulting -f db/seed_doctors.sql
```

Once real data exists this stops being acceptable and the project needs
migrations (Alembic) instead.

## Authentication

Two rules apply, and which one you hit depends on *how* you connect:

```
local  all all            trust           <- Unix socket: no password
host   all all 127.0.0.1  scram-sha-256   <- TCP: password required
host   all all ::1        scram-sha-256   <- TCP: password required
```

So `psql -U postgres -d doctorconsulting` connects with no password (socket),
while `postgresql://...@localhost:5432/...` is TCP and needs a real one. Both
point at the same server; only the transport differs. That asymmetry is the
usual source of "it works in psql but the app can't connect".

Two roles, deliberately:

| Role | Used for | Can |
|---|---|---|
| `postgres` | schema work, running the files in this folder | everything |
| `dc_app` | the application | read/write rows; **not** alter the schema |

`dc_app` is what `DATABASE_URL` uses. Running the app as a non-superuser means
a bug in a query cannot drop a table. Recreate it with the commands in
`.env.example`, or change its password with:

```bash
psql -U postgres -c "ALTER ROLE dc_app PASSWORD 'newpassword';"
```

then update `DATABASE_URL` and `PGPASSWORD` in `.env`.

To remove it entirely: `psql -U postgres -d doctorconsulting -c "DROP OWNED BY dc_app; DROP ROLE dc_app;"`

## The tables

| Table | Holds |
|---|---|
| `conditions` | The 12 treatable conditions. Mirrors `src/core/conditions.py`. |
| `doctors` | One row per doctor, keyed by slug. |
| `doctor_conditions` | Which doctor treats which condition — many-to-many. |
| `users` | Created from the mobile and email on the booking form. |
| `appointments` | A booked consultation: user, doctor, date, time, patient details. |
| `testimonials` | The user↔doctor junction, carrying the rating. |

### Decisions worth knowing

**`doctors.id` is the slug, not a number.** `anjali-menon` is already the
public identifier in `/api/doctors/{doctor_id}`, so keeping it as the primary
key means moving to Postgres changes no URLs.

**Patient details live on the appointment, not the user.** The person booking
is often not the person being seen, and age and reason change from visit to
visit. The user row is just the contact identity — name, email, mobile.

**`appointments.consultation_fee` is a snapshot.** A doctor's fee can change;
a past appointment must still remember what it actually cost.

**A doctor can't be double-booked.** A partial unique index on
`(doctor_id, scheduled_on, scheduled_at)` enforces it, excluding cancelled
rows so a released slot can be taken again.

**`doctors.rating` and `review_count` are denormalised.** The directory reads
them on every request. Recompute them when a testimonial is published rather
than aggregating on read:

```sql
UPDATE doctors d SET
    rating = COALESCE(t.avg_rating, 0),
    review_count = COALESCE(t.n, 0)
FROM (
    SELECT doctor_id, ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS n
    FROM testimonials WHERE is_published GROUP BY doctor_id
) t
WHERE d.id = t.doctor_id;
```

Note the seeded ratings are invented figures from the Python data, not
averages of anything — the first real testimonial will overwrite them.

**Testimonials are unpublished by default.** `is_published` starts `FALSE` so
reviews are read before they appear.

## Editing doctors

`seed_doctors.sql` was originally generated from a hardcoded Python tuple.
That tuple is gone — these tables are now the only source of doctor data, so
edit the database directly:

```sql
UPDATE doctors SET consultation_fee = 900 WHERE id = 'anjali-menon';
```

Changes show up on the next request; no restart. Keep `seed_doctors.sql` in
step if the change should survive a rebuild from scratch.

## How the app connects

```
handler → DoctorService → DoctorRepository → src/db pool → Postgres
```

`src/db/__init__.py` holds a lazily-opened `ConnectionPool`, built from
`DATABASE_URL` in `.env`. It is the only module that imports psycopg. The
pool opens on the first query and is closed by the FastAPI lifespan hook in
`src/main.py`.

`DoctorRepository` takes an optional pool so a test can point at a different
database; it falls back to the shared one.

## Tests

The doctor tests run real queries against this database. If Postgres is not
running they **skip** rather than fail — a missing server is an environment
problem, not a failing assertion. The bundle tests never touch Postgres.
