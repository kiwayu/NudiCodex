"""
NudibranchID.io Backend
FastAPI application for nudibranch species identification
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core import settings
from app.core.logging_config import configure_logging, get_logger
from app.core.middleware import (
    CorrelationIdMiddleware,
    LoggingMiddleware,
    SecurityHeadersMiddleware,
)

# Configure logging
configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info(
        "application_starting",
        project_name=settings.project_name,
        version=settings.api_version,
        environment=settings.environment,
        debug=settings.debug,
    )

    # Log configuration summary
    logger.info(
        "configuration_loaded",
        database=settings.database_url.split("@")[-1] if "@" in settings.database_url else "local",
        redis_enabled=settings.redis_enabled,
        storage_backend=settings.storage_backend,
        model_path=settings.model_path,
        max_upload_mb=settings.max_upload_size_mb,
        log_level=settings.log_level,
        log_format=settings.log_format,
    )

    yield

    # Shutdown
    logger.info("application_shutting_down")


# Create FastAPI application
app = FastAPI(
    title=settings.project_name,
    description="API for nudibranch species identification using machine learning",
    version=settings.api_version,
    debug=settings.debug,
    lifespan=lifespan,
    docs_url="/docs" if settings.enable_swagger_ui else None,
    redoc_url="/redoc" if settings.enable_redoc else None,
)

# Add middleware (order matters - first added = outermost)
# Security headers
app.add_middleware(SecurityHeadersMiddleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
    max_age=settings.cors_max_age,
)

# Logging middleware
app.add_middleware(LoggingMiddleware)

# Correlation ID middleware (innermost - runs first)
app.add_middleware(CorrelationIdMiddleware)


@app.get("/")
async def root():
    """Root endpoint"""
    logger.info("root_endpoint_accessed")
    return {
        "message": f"Welcome to {settings.project_name}",
        "version": settings.api_version,
        "status": "operational",
        "environment": settings.environment,
        "docs_url": "/docs" if settings.enable_swagger_ui else None,
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    logger.debug("health_check_requested")
    return {
        "status": "healthy",
        "version": settings.api_version,
        "environment": settings.environment,
        "features": {
            "user_accounts": settings.enable_user_accounts,
            "analytics": settings.enable_analytics,
            "feedback": settings.enable_feedback,
            "public_api": settings.enable_public_api,
        },
    }


@app.get("/config")
async def config_info():
    """Configuration information (non-sensitive)"""
    logger.info("config_endpoint_accessed")
    return {
        "api_version": settings.api_version,
        "environment": settings.environment,
        "model": {
            "version": settings.model_version,
            "input_size": settings.model_input_size,
            "top_k": settings.model_top_k,
            "confidence_threshold": settings.model_confidence_threshold,
        },
        "upload": {
            "max_size_mb": settings.max_upload_size_mb,
            "allowed_extensions": settings.allowed_image_extensions,
        },
        "storage": {
            "backend": settings.storage_backend,
        },
        "features": {
            "user_accounts": settings.enable_user_accounts,
            "registration": settings.enable_registration,
            "analytics": settings.enable_analytics,
            "feedback": settings.enable_feedback,
            "species_suggestions": settings.enable_species_suggestions,
        },
        "rate_limits": {
            "enabled": settings.rate_limit_enabled,
            "per_minute": settings.rate_limit_per_minute,
            "per_hour": settings.rate_limit_per_hour,
        },
    }


@app.get("/test-logging")
async def test_logging():
    """Test endpoint to demonstrate logging with different levels"""
    logger.debug("debug_message", detail="This is a debug log")
    logger.info("info_message", detail="This is an info log", user_action="test")
    logger.warning("warning_message", detail="This is a warning log")
    
    return {
        "message": "Logging test completed",
        "note": "Check server logs for output with correlation ID",
    }


@app.get("/test-error")
async def test_error():
    """Test endpoint to demonstrate error logging"""
    try:
        # Intentional error for testing
        result = 1 / 0
    except Exception as e:
        logger.error(
            "calculation_error",
            error=str(e),
            error_type=type(e).__name__,
            exc_info=True,
        )
        raise


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=settings.api_host,
        port=settings.api_port,
        log_level=settings.log_level.lower(),
    )
