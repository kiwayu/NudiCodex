"""
Tests for logging configuration
"""

import json
from io import StringIO

import pytest
import structlog

from app.core.logging_config import (
    add_app_context,
    add_correlation_id,
    configure_logging,
    get_correlation_id,
    get_logger,
    set_correlation_id,
)


def test_get_logger():
    """Test getting a logger instance"""
    logger = get_logger(__name__)
    assert isinstance(logger, structlog.stdlib.BoundLogger)


def test_correlation_id_context():
    """Test setting and getting correlation ID"""
    test_id = "test-correlation-id-123"
    
    set_correlation_id(test_id)
    assert get_correlation_id() == test_id


def test_add_correlation_id_processor():
    """Test correlation ID processor"""
    set_correlation_id("test-id")
    
    event_dict = {}
    result = add_correlation_id(None, "", event_dict)
    
    assert "correlation_id" in result
    assert result["correlation_id"] == "test-id"


def test_add_app_context_processor():
    """Test app context processor"""
    from app.core import settings
    
    event_dict = {}
    result = add_app_context(None, "", event_dict)
    
    assert "app" in result
    assert "environment" in result
    assert "version" in result
    assert result["app"] == settings.project_name


def test_logger_output_json(capsys):
    """Test JSON logger output"""
    from app.core.config import Settings
    
    # Configure with JSON format
    settings = Settings(log_format="json")
    configure_logging()
    
    logger = get_logger("test")
    logger.info("test_message", key="value")
    
    # Note: This is a basic test - in real scenarios you'd capture the actual output


def test_logger_levels():
    """Test different log levels"""
    logger = get_logger("test")
    
    # Should not raise exceptions
    logger.debug("debug message", level="DEBUG")
    logger.info("info message", level="INFO")
    logger.warning("warning message", level="WARNING")
    logger.error("error message", level="ERROR")


def test_logger_with_exception():
    """Test logging with exception"""
    logger = get_logger("test")
    
    try:
        raise ValueError("Test error")
    except Exception:
        # Should not raise - exc_info captures the exception
        logger.error("error_occurred", exc_info=True)

