"""Application configuration using Pydantic Settings."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:password@localhost:5432/moneypot",
        description="PostgreSQL connection string",
    )

    # OpenAI
    openai_api_key: str = Field(default="", description="OpenAI API key")
    openai_model: str = Field(default="gpt-4o", description="OpenAI model to use")

    # Opik (observability)
    opik_api_key: str | None = Field(default=None, description="Opik API key")
    opik_project_name: str = Field(default="moneypot-coach", description="Opik project name")

    # App settings
    debug: bool = Field(default=False, description="Debug mode")
    cors_origins: list[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000"],
        description="Allowed CORS origins",
    )

    # API
    api_v1_prefix: str = Field(default="/api/v1", description="API v1 prefix")


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
