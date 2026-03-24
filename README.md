# Oneyworld — AI Prompt Registry

A small full-stack app: save AI prompts in **Supabase**, browse them in a **Next.js** UI (**HeroUI v3**), and read the same data through a **FastAPI** serverless API under `/api`.

## Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js (App Router), React 19, Tailwind CSS v4, HeroUI v3 |
| Database | Supabase (Postgres) — `ai_prompts` table |
| Server actions | Next.js — create prompts (`insert`) |
| Read API | Python FastAPI in `api/index.py` (Vercel serverless) |

## Prerequisites

- Node.js 18+ and [pnpm](https://pnpm.io)
- Python 3.12+ (for local FastAPI)
- A [Supabase](https://supabase.com) project

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (Settings → API) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon / publishable key |

Optional (server-only overrides; if omitted, the Python API falls back to the `NEXT_PUBLIC_*` values):

- `SUPABASE_URL`
- `SUPABASE_KEY`

## Database

Run the SQL in `supabase/migrations/20250324120000_ai_prompts.sql` in the Supabase **SQL Editor** (or your migration workflow). This creates `public.ai_prompts` and demo RLS policies.

## Local development

**Terminal 1 — Next.js (port 3000)**

```bash
pnpm install
pnpm dev
```

**Terminal 2 — FastAPI (port 8000)** — required for `/api/*` routes (Swagger, list, health) via Next rewrites.

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pnpm py:dev
```

Open [http://localhost:3000](http://localhost:3000).

## HTTP API (FastAPI)

Base path on the same origin: `/api`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/prompts` | List prompts (`limit`, `offset` query params) |
| `GET` | `/api/prompts/{id}` | Single prompt by UUID |
| `GET` | `/api/docs` | Swagger UI |
| `GET` | `/api/openapi.json` | OpenAPI schema |

The home page also tries `GET /api/prompts` first (Python); if that fails (e.g. build without `py:dev`), it falls back to a direct Supabase read in `lib/load-prompts.ts`.

## Deploy on Vercel

1. Connect the repo and deploy (root directory = repository root).
2. In **Project → Settings → Environment Variables**, add at least `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for Production (and Preview if needed).
3. Redeploy.

Verify:

- `https://<your-domain>.vercel.app/api/health` → `{"status":"ok"}`
- `https://<your-domain>.vercel.app/api/docs` → Swagger UI

No extra Python-specific toggle is required; `requirements.txt` and `api/index.py` are picked up automatically.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Next.js dev server |
| `pnpm py:dev` | Uvicorn: `api.index:app` on `127.0.0.1:8000` |
| `pnpm build` | Production build |
| `pnpm start` | Start Next.js production server |

## License

Private project (`private` in `package.json`).
