"""
Application configuration using pydantic-settings
Comprehensive settings management with validation
"""

from functools import lru_cache
from typing import List, Literal

from pydantic import Field, field_validator, HttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ===========================
    # Application Info
    # ===========================
    project_name: str = Field(default="NudibranchID.io API")
    api_version: str = Field(default="1.0.0")
    api_v1_prefix: str = Field(default="/api/v1")
    debug: bool = Field(default=False)
    environment: Literal["development", "staging", "production"] = Field(
        default="development"
    )

    # ===========================
    # Server Configuration
    # ===========================
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8000)

    # ===========================
    # Database Configuration
    # ===========================
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/nudibranchid"
    )
    database_pool_size: int = Field(default=10, ge=1, le=100)
    database_max_overflow: int = Field(default=20, ge=0, le=100)
    database_pool_timeout: int = Field(default=30, ge=1)
    database_pool_recycle: int = Field(default=3600, ge=60)
    database_echo: bool = Field(default=False)

    @field_validator("database_url")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        """Validate database URL format"""
        if not v.startswith(("postgresql://", "postgresql+asyncpg://")):
            raise ValueError(
                "Database URL must start with postgresql:// or postgresql+asyncpg://"
            )
        return v

    # ===========================
    # Redis Configuration
    # ===========================
    redis_url: str = Field(default="redis://localhost:6379/0")
    redis_max_connections: int = Field(default=10, ge=1, le=100)
    redis_socket_timeout: int = Field(default=5, ge=1)
    redis_socket_connect_timeout: int = Field(default=5, ge=1)
    redis_cache_ttl: int = Field(default=300, ge=0)  # 5 minutes default
    redis_session_ttl: int = Field(default=86400, ge=0)  # 24 hours
    redis_enabled: bool = Field(default=True)

    @field_validator("redis_url")
    @classmethod
    def validate_redis_url(cls, v: str) -> str:
        """Validate Redis URL format"""
        if not v.startswith(("redis://", "rediss://")):
            raise ValueError("Redis URL must start with redis:// or rediss://")
        return v

    # ===========================
    # CORS Configuration
    # ===========================
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"]
    )
    cors_allow_credentials: bool = Field(default=True)
    cors_allow_methods: List[str] = Field(default=["*"])
    cors_allow_headers: List[str] = Field(default=["*"])
    cors_max_age: int = Field(default=600)  # 10 minutes

    # ===========================
    # Rate Limiting
    # ===========================
    rate_limit_enabled: bool = Field(default=True)
    rate_limit_per_minute: int = Field(default=60, ge=1)
    rate_limit_per_hour: int = Field(default=1000, ge=1)
    rate_limit_per_day: int = Field(default=10000, ge=1)
    rate_limit_burst: int = Field(default=10, ge=1)

    # ===========================
    # ML Model Configuration
    # ===========================
    model_path: str = Field(default="../data/models/nudibranch_classifier.h5")
    model_version: str = Field(default="1.0.0")
    model_input_size: int = Field(default=224, ge=32)  # Image input size (224x224)
    model_confidence_threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    model_top_k: int = Field(default=5, ge=1, le=20)  # Top K predictions
    model_batch_size: int = Field(default=32, ge=1)
    model_use_gpu: bool = Field(default=True)
    model_cache_predictions: bool = Field(default=True)
    model_warmup_on_startup: bool = Field(default=True)

    # ===========================
    # File Upload Configuration
    # ===========================
    max_upload_size: int = Field(default=10485760, ge=1024)  # 10MB in bytes
    allowed_image_extensions: List[str] = Field(default=["jpg", "jpeg", "png", "webp"])
    allowed_mime_types: List[str] = Field(
        default=["image/jpeg", "image/png", "image/webp"]
    )
    upload_dir: str = Field(default="../data/uploads")
    temp_dir: str = Field(default="../data/temp")
    thumbnails_dir: str = Field(default="../data/thumbnails")
    thumbnail_size: int = Field(default=256, ge=32)
    preserve_exif: bool = Field(default=False)

    # ===========================
    # Storage Configuration (S3/MinIO)
    # ===========================
    storage_backend: Literal["local", "s3", "minio"] = Field(default="local")
    
    # S3/MinIO settings
    s3_endpoint_url: str | None = Field(default=None)
    s3_access_key_id: str | None = Field(default=None)
    s3_secret_access_key: str | None = Field(default=None)
    s3_region: str = Field(default="us-east-1")
    s3_bucket_name: str = Field(default="nudibranchid-images")
    s3_use_ssl: bool = Field(default=True)
    s3_presigned_url_expiration: int = Field(default=3600, ge=60)  # 1 hour

    @field_validator("s3_endpoint_url")
    @classmethod
    def validate_s3_endpoint(cls, v: str | None) -> str | None:
        """Validate S3 endpoint URL if provided"""
        if v is not None and not v.startswith(("http://", "https://")):
            raise ValueError("S3 endpoint URL must start with http:// or https://")
        return v

    # ===========================
    # Security Configuration
    # ===========================
    secret_key: str = Field(
        default="change-this-to-a-secure-random-key-in-production"
    )
    algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30, ge=1)
    refresh_token_expire_days: int = Field(default=7, ge=1)
    password_min_length: int = Field(default=8, ge=6)
    password_require_uppercase: bool = Field(default=True)
    password_require_lowercase: bool = Field(default=True)
    password_require_digits: bool = Field(default=True)
    password_require_special: bool = Field(default=False)
    bcrypt_rounds: int = Field(default=12, ge=4, le=31)

    # ===========================
    # Logging Configuration
    # ===========================
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(
        default="INFO"
    )
    log_format: Literal["json", "console"] = Field(default="json")
    log_file: str = Field(default="logs/app.log")
    log_rotation: str = Field(default="20 MB")  # Rotate when file reaches 20MB
    log_retention: str = Field(default="30 days")  # Keep logs for 30 days
    log_compression: bool = Field(default=True)
    log_to_file: bool = Field(default=True)
    log_to_console: bool = Field(default=True)

    # ===========================
    # Feature Flags
    # ===========================
    enable_analytics: bool = Field(default=False)
    enable_feedback: bool = Field(default=True)
    enable_user_accounts: bool = Field(default=True)
    enable_registration: bool = Field(default=True)
    enable_email_verification: bool = Field(default=False)
    enable_social_auth: bool = Field(default=False)
    enable_species_suggestions: bool = Field(default=True)
    enable_public_api: bool = Field(default=False)
    enable_admin_panel: bool = Field(default=True)
    enable_swagger_ui: bool = Field(default=True)
    enable_redoc: bool = Field(default=True)
    enable_metrics: bool = Field(default=True)

    # ===========================
    # Email Configuration (Optional)
    # ===========================
    smtp_enabled: bool = Field(default=False)
    smtp_host: str = Field(default="smtp.gmail.com")
    smtp_port: int = Field(default=587, ge=1, le=65535)
    smtp_user: str | None = Field(default=None)
    smtp_password: str | None = Field(default=None)
    smtp_from_email: str = Field(default="noreply@nudibranchid.io")
    smtp_from_name: str = Field(default="NudibranchID.io")
    smtp_use_tls: bool = Field(default=True)

    # ===========================
    # Monitoring & Analytics (Optional)
    # ===========================
    sentry_dsn: str | None = Field(default=None)
    sentry_environment: str = Field(default="development")
    sentry_traces_sample_rate: float = Field(default=0.1, ge=0.0, le=1.0)

    # Google Analytics
    ga_measurement_id: str | None = Field(default=None)

    # ===========================
    # Pagination
    # ===========================
    default_page_size: int = Field(default=20, ge=1, le=100)
    max_page_size: int = Field(default=100, ge=1, le=1000)

    # ===========================
    # Background Tasks
    # ===========================
    celery_broker_url: str | None = Field(default=None)
    celery_result_backend: str | None = Field(default=None)
    enable_background_tasks: bool = Field(default=False)

    # ===========================
    # Helper Properties
    # ===========================
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.environment == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development"""
        return self.environment == "development"

    @property
    def max_upload_size_mb(self) -> float:
        """Get max upload size in MB"""
        return self.max_upload_size / (1024 * 1024)

    @property
    def redis_cache_ttl_seconds(self) -> int:
        """Get Redis cache TTL in seconds"""
        return self.redis_cache_ttl

    @property
    def database_url_sync(self) -> str:
        """Get synchronous database URL (for Alembic)"""
        return self.database_url.replace("+asyncpg", "")


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance (singleton pattern)
    
    Returns:
        Settings: Application settings
    """
    return Settings()


# Global settings instance
settings = get_settings()
