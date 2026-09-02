from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.handlers import bundles, doctors
from src.core import config

app = FastAPI(title="DoctorConsulting API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(bundles.router)
app.include_router(doctors.router)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}
