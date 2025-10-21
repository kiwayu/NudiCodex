"""
Application configuration using pydantic-settings
"""

from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/nudibranchid"
    )
    database_pool_size: int = Field(default=10)
    database_max_overflow: int = Field(default=20)

    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0")
    redis_max_connections: int = Field(default=10)

    # API
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8000)
    debug: bool = Field(default=True)
    api_v1_prefix: str = Field(default="/api/v1")
    project_name: str = Field(default="NudibranchID.io API")

    # Security
    secret_key: str = Field(default="change-this-secret-key-in-production")
    algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30)
    refresh_token_expire_days: int = Field(default=7)

    # CORS
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"]
    )
    cors_allow_credentials: bool = Field(default=True)
    cors_allow_methods: List[str] = Field(default=["*"])
    cors_allow_headers: List[str] = Field(default=["*"])

    # ML Model
    model_path: str = Field(default="../data/models/nudibranch_classifier.h5")
    model_version: str = Field(default="1.0.0")
    model_confidence_threshold: float = Field(default=0.7)
    enable_model_cache: bool = Field(default=True)

    # File Upload
    max_upload_size: int = Field(default=10485760)  # 10MB
    allowed_extensions: List[str] = Field(default=["jpg", "jpeg", "png", "webp"])
    upload_dir: str = Field(default="../data/uploads")
    temp_dir: str = Field(default="../data/temp")

    # Logging
    log_level: str = Field(default="INFO")
    log_format: str = Field(default="json")
    log_file: str = Field(default="logs/app.log")

    # Rate Limiting
    rate_limit_enabled: bool = Field(default=True)
    rate_limit_per_minute: int = Field(default=60)
    rate_limit_per_hour: int = Field(default=1000)

    # Feature Flags
    enable_registration: bool = Field(default=True)
    enable_email_verification: bool = Field(default=False)
    enable_species_suggestions: bool = Field(default=True)


# Global settings instance
settings = Settings()

