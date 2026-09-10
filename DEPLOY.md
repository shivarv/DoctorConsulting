# Deploying

`docker-compose.yml` is for your laptop. This is the deployed setup.

Target is Render, described by [`render.yaml`](render.yaml), but nothing here
is Render-specific beyond that one file — see [Other platforms](#other-platforms).

---

## The shape of it

| Piece | Local | Deployed |
|---|---|---|
| Database | `postgres:18-alpine` container, volume `pgdata` | Render managed Postgres 18 |
| API | `Dockerfile`, uvicorn `--reload`, bind-mounted source | Same `Dockerfile`, no reload, no mounts |
| Frontend | `frontend/Dockerfile`, Vite dev server on :5173 | `npm run build` → static files on a CDN |

Two things genuinely change, and both are worth understanding before you start.

**The frontend stops being a container.** Locally it is a dev server. Deployed
it is a folder of static files, because that is what Vite produces and what a
CDN serves for free. `frontend/Dockerfile` stays dev-only — never deploy it.
(If you want the frontend containerised anyway, `frontend/Dockerfile.prod`
does that; see [Other platforms](#other-platforms).)

**The database starts empty and stays empty until you load it.** This is the
part that surprises people, so it gets its own section.

---

## How data gets into the deployed database

Locally you never think about this. `docker-compose.yml` mounts the SQL files
into `/docker-entrypoint-initdb.d/`, and the Postgres image runs everything in
that directory the first time it starts on an empty data directory. You get 18
doctors for free.

**Managed Postgres has no such hook.** Render, Neon, Supabase and RDS all hand
you a running, completely empty database and a connection string. Nothing will
ever run `db/schema.sql` for you. So it is pushed in from outside, once:

```bash
# Render dashboard → your database → copy the External Database URL
./db/bootstrap.sh "postgresql://user:password@host.oregon-postgres.render.com/doctorconsulting"
```

That applies [`db/schema.sql`](db/schema.sql) then
[`db/seed_doctors.sql`](db/seed_doctors.sql) and prints what landed:

```
==> schema.sql
==> seed_doctors.sql

==> Contents
       table       | rows
-------------------+------
 appointments      |    0
 conditions        |   12
 doctor_conditions |   31
 doctors           |   18
 testimonials      |    0
 users             |    0
```

Use the **External** URL, not the internal one — the internal hostname only
resolves from inside Render's network, so it will hang from your laptop.

### Updating the demo data later

Re-run the same command. It is safe, and this is the intended workflow:

- `schema.sql` guards every statement with `IF NOT EXISTS`.
- `seed_doctors.sql` upserts every row (`ON CONFLICT ... DO UPDATE`) and
  rebuilds `doctor_conditions` wholesale, so a speciality you delete from the
  file actually disappears from the database.

So: edit the SQL, commit, re-run `bootstrap.sh`. No migration tooling needed
while the seed is the source of truth. Verified by running it twice against a
throwaway database — identical row counts, no errors.

### Two things the script deliberately does not do

**It skips `db/roles.sql`.** That file creates the `dc_app` role with the
password `dc_local_dev` hardcoded in it. Fine locally, not something to put in
a deployed database. Render gives you one owner role and its connection string,
and `render.yaml` wires that straight into `DATABASE_URL`.

That does mean the deployed API connects as the table owner, with more rights
than it needs — locally `dc_app` cannot alter the schema, so a bad query can't
destroy it. To get that protection back once you have real data, create the
role by hand with a real secret, then point `DATABASE_URL` at it:

```bash
psql "$EXTERNAL_URL" -c "CREATE ROLE dc_app LOGIN PASSWORD 'a-real-secret';"
psql "$EXTERNAL_URL" -f db/roles.sql   # grants only; the role already exists
```

**It never drops or alters an existing table.** Once real appointments exist,
a schema change needs a real migration. `bootstrap.sh` is for standing a
database up and for reference data, not for evolving a live schema.

### Availability needs no data

`/api/doctors/{id}/availability` is generated in
[`src/services/doctor_service.py`](src/services/doctor_service.py#L41), not
stored. Nothing to seed, and it works the moment doctors exist.

---

## First deploy

**1. Push, then create the blueprint.** Render → New → Blueprint → this repo.
It reads `render.yaml` and creates all three services. `DATABASE_URL` is wired
automatically; you never copy a password.

**2. Fix the two cross-references.** `render.yaml` hardcodes each service's
public URL, because Render's `fromService` only exposes a bare hostname and
both of these need a scheme. If either name was already taken globally, Render
appended a suffix — check the real URLs and correct:

- API service → `CORS_ORIGINS` must be the frontend's exact origin
  (`https://…`, no trailing slash).
- Static site → `VITE_API_BASE_URL` must be the API's URL. **Changing this
  requires a rebuild, not a restart** — Vite inlines it into the bundle at
  build time (verified: the built JS contains the literal string).

**3. Load the database.** The `bootstrap.sh` command above. The API is healthy
before this — `/health` touches no database — but `/api/doctors` returns a 500
until it runs.

**4. Check it.**

```bash
curl https://your-api.onrender.com/health              # {"status":"ok"}
curl https://your-api.onrender.com/api/doctors | head  # 18 doctors
```

Then open the frontend and confirm the doctors list renders. If the page loads
but shows an error state, it is almost always `CORS_ORIGINS` — check the
browser console for a CORS message rather than guessing.

---

## Things that will bite you

**Free instances sleep.** After 15 minutes idle a free web service spins down;
the next request takes ~50 seconds while it wakes. Mid-demo this looks like a
broken app. The frontend is a CDN static site so it stays instant, which makes
it worse — the page appears immediately and the data hangs. Paid instances
($7/mo) don't sleep.

**Free Postgres is deleted after 30 days.** Not paused. Deleted. Everything
here is reproducible from `bootstrap.sh`, so for demo data that is survivable,
but do not put anything you care about on it.

**Region must match.** If the API and the database are in different regions the
internal connection string won't resolve. `render.yaml` pins both to `oregon`;
change both together or neither.

**Connection limits.** [`src/db/__init__.py`](src/db/__init__.py#L38) uses
`max_size=10`, and each uvicorn worker gets its own pool. The `Dockerfile`
therefore runs a single worker on purpose. If you ever add `--workers N`, drop
`max_size` to roughly `20 / N` first.

**CORS only allows GET.** [`src/main.py`](src/main.py#L23) sets
`allow_methods=["GET"]`, which matches the three read-only routes that exist
today. The moment you add a booking `POST`, that list needs `"POST"` too — the
browser will send a preflight and get refused, which reads as a mysterious
network failure rather than a permissions error.

**Booking doesn't persist yet.** The `appointments` table exists in the schema
and the wizard in `frontend/src/features/booking/` collects everything, but
there is no write endpoint, so nothing is saved. Deploying does not change
that. Worth knowing before someone tries to book on the live site.

**`.env` is not in the image, by design.** `.dockerignore` excludes it, so
[`load_dotenv`](src/core/config.py#L10) silently finds nothing and falls
through to real environment variables. Correct behaviour — but it means every
variable must be set in the dashboard, and a missing one fails at runtime, not
at build time.

---

## Other platforms

Only `render.yaml` is Render-specific. The images are portable:

```bash
# API
docker build -t dc-api .
docker run -e DATABASE_URL="postgresql://..." -e CORS_ORIGINS="https://..." -e PORT=8000 -p 8000:8000 dc-api

# Frontend, containerised instead of static
docker build -f frontend/Dockerfile.prod \
  --build-arg VITE_API_BASE_URL=https://your-api.example.com \
  -t dc-web ./frontend
docker run -p 8080:80 dc-web
```

Both honour `$PORT`, which is what Fly, Cloud Run, Railway and Heroku assign.
`frontend/Dockerfile.prod` is a multi-stage build — Vite in node, output served
by nginx, with the SPA rewrite for `BrowserRouter` and immutable caching on the
fingerprinted assets in `dist/assets/`.

**Railway** is the closest alternative and understands this repo's structure
with less configuration, but has no free tier (~$5/mo). **Fly.io** works and
gives you real always-on instances, but you manage Postgres and volumes
yourself. `bootstrap.sh` is how you seed the database on any of them.

---

## Backups

Once there is data worth keeping:

```bash
pg_dump "$EXTERNAL_URL" -Fc -f backup.dump
pg_restore -d "$TARGET_URL" --clean --if-exists backup.dump
```

Render's paid tiers do this daily. The free tier does not.
