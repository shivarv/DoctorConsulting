from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.handlers import bundles
from src.core import config

app = FastAPI(title="Yoga Bundles API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(bundles.router)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}
