from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.handlers import bundles, doctors
from src.core import config
from src.db import close_pool


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # The pool opens lazily on the first query, so there is nothing to do on
    # the way up — only connections to hand back on the way down.
    yield
    close_pool()


app = FastAPI(title="DoctorConsulting API", version="0.3.0", lifespan=lifespan)

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
