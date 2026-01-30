"""OpenAI client with Opik tracing."""

import logging
from functools import lru_cache

from openai import AsyncOpenAI

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _configure_opik() -> None:
    """Configure Opik for tracing if API key is available."""
    if settings.opik_api_key:
        try:
            import opik

            opik.configure(
                api_key=settings.opik_api_key,
                project_name=settings.opik_project_name,
            )
            logger.info(f"Opik configured for project: {settings.opik_project_name}")
        except Exception as e:
            logger.warning(f"Failed to configure Opik: {e}")


@lru_cache
def get_openai_client() -> AsyncOpenAI:
    """Get OpenAI client with optional Opik tracing."""
    _configure_opik()

    client = AsyncOpenAI(api_key=settings.openai_api_key)

    # Wrap with Opik if available
    if settings.opik_api_key:
        try:
            from opik.integrations.openai import track_openai

            client = track_openai(client)
            logger.info("OpenAI client wrapped with Opik tracing")
        except Exception as e:
            logger.warning(f"Failed to wrap OpenAI client with Opik: {e}")

    return client
