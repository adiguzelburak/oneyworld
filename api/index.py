"""
Vercel serverless FastAPI: Supabase `ai_prompts` tablosunu okur.
Yerelde: `pnpm py:dev` ile 8000 portunda çalıştır; Next rewrites proxy eder.
"""

import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated, Optional
from uuid import UUID

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query
from pydantic import BaseModel
from supabase import Client, create_client

_REPO_ROOT = Path(__file__).resolve().parents[1]


def _load_env() -> None:
    load_dotenv(_REPO_ROOT / ".env.local")
    load_dotenv(_REPO_ROOT / ".env")


_load_env()


def _supabase_url() -> str:
    return (
        os.getenv("SUPABASE_URL", "").strip()
        or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "").strip()
    )


def _supabase_key() -> str:
    return (
        os.getenv("SUPABASE_KEY", "").strip()
        or os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "").strip()
        or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "").strip()
    )


def get_supabase() -> Client:
    url, key = _supabase_url(), _supabase_key()
    if not url or not key:
        raise HTTPException(
            status_code=503,
            detail=(
                "Supabase yapılandırması eksik. "
                "SUPABASE_URL + SUPABASE_KEY veya NEXT_PUBLIC_SUPABASE_URL + "
                "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY tanımlayın."
            ),
        )
    return create_client(url, key)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    _load_env()
    yield


app = FastAPI(
    title="Oneyworld Prompt API",
    description="Supabase üzerindeki AI prompt kayıtlarını okur.",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)


class AiPrompt(BaseModel):
    id: UUID
    title: Optional[str] = None
    content: str
    created_at: str


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/prompts", response_model=list[AiPrompt])
def list_prompts(
    supabase: Annotated[Client, Depends(get_supabase)],
    limit: Annotated[int, Query(ge=1, le=500, description="En fazla kaç kayıt")] = 100,
    offset: Annotated[int, Query(ge=0, description="Sayfalama için atlanacak kayıt sayısı")] = 0,
):
    try:
        response = (
            supabase.table("ai_prompts")
            .select("id, title, content, created_at")
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=502,
            detail=f"Supabase isteği başarısız: {e!s}",
        ) from e

    if response.data is None:
        return []

    return [AiPrompt.model_validate(row) for row in response.data]


@app.get("/api/prompts/{prompt_id}", response_model=AiPrompt)
def get_prompt(
    prompt_id: UUID,
    supabase: Annotated[Client, Depends(get_supabase)],
):
    response = (
        supabase.table("ai_prompts")
        .select("id, title, content, created_at")
        .eq("id", str(prompt_id))
        .limit(1)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Prompt bulunamadı.")

    return AiPrompt.model_validate(response.data[0])
