# MoneyPot AI Financial Health Coach - Backend

## Quick Start

```bash
# Install dependencies
uv sync

# Run the server (development)
uv run uvicorn app.main:app --reload --port 8000

# Run migrations (requires PostgreSQL running)
uv run alembic upgrade head
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Pydantic Settings
│   ├── api/
│   │   ├── deps.py          # DB session, current user
│   │   └── v1/              # API routes
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   ├── ai/                  # OpenAI + Opik integration
│   ├── db/                  # Database session
│   └── core/                # Exceptions, middleware
├── alembic/                 # Database migrations
└── tests/                   # Test files
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/moneypot
OPENAI_API_KEY=sk-your-key
OPIK_API_KEY=your-opik-key  # Optional
DEBUG=true
```

## API Endpoints

- `GET /health` - Health check
- `GET /docs` - OpenAPI documentation (debug mode only)
- `/api/v1/users` - User management
- `/api/v1/pots` - Money pot management
- `/api/v1/goals` - Financial goals
- `/api/v1/expenses` - Expense tracking
- `/api/v1/chat` - AI coach chat (SSE streaming)
- `/api/v1/analytics` - Dashboard & insights
- `/api/v1/impact` - Purchase impact analysis

## Authentication

MVP uses `X-User-ID` header for user identification. Pass a UUID in this header for all authenticated requests.

## Key Technologies

- **FastAPI** - Async web framework
- **SQLAlchemy 2.0** - Async ORM with PostgreSQL
- **OpenAI GPT-4** - AI coaching
- **Opik** - AI observability and tracing
- **SSE** - Real-time streaming responses
