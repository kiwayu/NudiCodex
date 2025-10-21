"""
Structured logging configuration using structlog
Includes correlation IDs for request tracing
"""

import logging
import sys
from typing import Any

import structlog
from structlog.types import EventDict, Processor

from app.core.config import settings


def add_correlation_id(logger: Any, method_name: str, event_dict: EventDict) -> EventDict:
    """
    Add correlation ID to log entries for request tracing
    
    Correlation ID is extracted from context variables set by middleware
    """
    from contextvars import ContextVar
    
    correlation_id: ContextVar[str | None] = ContextVar("correlation_id", default=None)
    
    cid = correlation_id.get()
    if cid:
        event_dict["correlation_id"] = cid
    
    return event_dict


def add_app_context(logger: Any, method_name: str, event_dict: EventDict) -> EventDict:
    """Add application context to log entries"""
    event_dict["app"] = settings.project_name
    event_dict["environment"] = settings.environment
    event_dict["version"] = settings.api_version
    return event_dict


def drop_debug_logs(logger: Any, method_name: str, event_dict: EventDict) -> EventDict:
    """Drop debug logs in production if needed"""
    if settings.is_production and event_dict.get("level") == "debug":
        raise structlog.DropEvent
    return event_dict


def configure_logging() -> None:
    """
    Configure structured logging with structlog
    
    Features:
    - JSON logging for production
    - Pretty console logging for development
    - Correlation IDs for request tracing
    - Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
    - Different outputs for dev vs prod
    """
    
    # Configure standard library logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, settings.log_level),
    )
    
    # Silence noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    
    # Common processors for all environments
    common_processors: list[Processor] = [
        # Add log level
        structlog.stdlib.add_log_level,
        
        # Add logger name
        structlog.stdlib.add_logger_name,
        
        # Add timestamp
        structlog.processors.TimeStamper(fmt="iso", utc=True),
        
        # Add correlation ID
        add_correlation_id,
        
        # Add app context
        add_app_context,
        
        # Merge context variables
        structlog.contextvars.merge_contextvars,
        
        # Format positional arguments
        structlog.stdlib.PositionalArgumentsFormatter(),
        
        # Add stack info for exceptions
        structlog.processors.StackInfoRenderer(),
        
        # Format exceptions
        structlog.processors.format_exc_info,
        
        # Ensure strings are unicode
        structlog.processors.UnicodeDecoder(),
    ]
    
    # Development processors (pretty console output)
    dev_processors: list[Processor] = common_processors + [
        # Pretty console rendering
        structlog.dev.ConsoleRenderer(
            colors=True,
            exception_formatter=structlog.dev.plain_traceback,
        )
    ]
    
    # Production processors (JSON output)
    prod_processors: list[Processor] = common_processors + [
        # Drop debug logs in production if needed
        drop_debug_logs,
        
        # Rename event key to message
        structlog.processors.EventRenamer("message"),
        
        # JSON rendering
        structlog.processors.JSONRenderer(),
    ]
    
    # Choose processors based on environment
    if settings.log_format == "json" or settings.is_production:
        processors = prod_processors
    else:
        processors = dev_processors
    
    # Configure structlog
    structlog.configure(
        processors=processors,
        wrapper_class=structlog.stdlib.BoundLogger,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str | None = None) -> structlog.stdlib.BoundLogger:
    """
    Get a structured logger instance
    
    Args:
        name: Logger name (usually __name__)
        
    Returns:
        BoundLogger: Configured structlog logger
        
    Example:
        >>> logger = get_logger(__name__)
        >>> logger.info("user_login", user_id=123, ip="192.168.1.1")
        >>> logger.error("authentication_failed", error="Invalid credentials", user_id=123)
    """
    return structlog.get_logger(name)


# Context variable for correlation ID
from contextvars import ContextVar

correlation_id_var: ContextVar[str | None] = ContextVar("correlation_id", default=None)


def set_correlation_id(correlation_id: str) -> None:
    """Set correlation ID for current context"""
    correlation_id_var.set(correlation_id)


def get_correlation_id() -> str | None:
    """Get correlation ID from current context"""
    return correlation_id_var.get()


# Pre-configured logger for convenience
logger = get_logger(__name__)

