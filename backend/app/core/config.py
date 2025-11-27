"""Application configuration settings."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "Smart Assistant"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://assistant:assistant_dev@localhost:5432/smart_assistant"

    # API Keys
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    EXCHANGERATE_API_KEY: str = ""

    # Email Configuration (Resend)
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = ""

    # LLM Settings
    LLM_PROVIDER: str = "openai"  # openai, anthropic, local
    LLM_MODEL: str = "gpt-4"
    LLM_TEMPERATURE: float = 0.7
    LLM_MAX_TOKENS: int = 500

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 10

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
