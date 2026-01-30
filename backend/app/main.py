"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.config import get_settings
from app.core.middleware import RequestLoggingMiddleware

settings = get_settings()

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    logger.info("Starting MoneyPot AI Financial Coach API")
    yield
    logger.info("Shutting down MoneyPot API")


app = FastAPI(
    title="MoneyPot AI Financial Coach",
    description="Backend API for the AI-powered financial health coach",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request logging middleware
app.add_middleware(RequestLoggingMiddleware)

# Include API router
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "0.1.0",
    }


@app.get("/")
async def root() -> dict:
    """Root endpoint."""
    return {
        "name": "MoneyPot AI Financial Coach",
        "version": "0.1.0",
        "docs": "/docs" if settings.debug else "disabled",
    }
