"""
Tests for configuration system
"""

import pytest
from pydantic import ValidationError

from app.core.config import Settings, get_settings


def test_settings_defaults():
    """Test that settings have correct defaults"""
    settings = Settings()
    
    assert settings.project_name == "NudibranchID.io API"
    assert settings.api_version == "1.0.0"
    assert settings.debug is False
    assert settings.environment == "development"


def test_settings_singleton():
    """Test that get_settings returns the same instance"""
    settings1 = get_settings()
    settings2 = get_settings()
    
    assert settings1 is settings2


def test_database_url_validation():
    """Test database URL validation"""
    # Valid URLs
    Settings(database_url="postgresql://user:pass@localhost:5432/db")
    Settings(database_url="postgresql+asyncpg://user:pass@localhost:5432/db")
    
    # Invalid URL
    with pytest.raises(ValidationError):
        Settings(database_url="mysql://user:pass@localhost:3306/db")


def test_redis_url_validation():
    """Test Redis URL validation"""
    # Valid URLs
    Settings(redis_url="redis://localhost:6379/0")
    Settings(redis_url="rediss://localhost:6379/0")
    
    # Invalid URL
    with pytest.raises(ValidationError):
        Settings(redis_url="http://localhost:6379")


def test_s3_endpoint_validation():
    """Test S3 endpoint URL validation"""
    # Valid endpoints
    Settings(s3_endpoint_url="http://localhost:9000")
    Settings(s3_endpoint_url="https://s3.amazonaws.com")
    Settings(s3_endpoint_url=None)
    
    # Invalid endpoint
    with pytest.raises(ValidationError):
        Settings(s3_endpoint_url="localhost:9000")


def test_pool_size_constraints():
    """Test database pool size constraints"""
    # Valid values
    Settings(database_pool_size=10)
    Settings(database_pool_size=1)
    Settings(database_pool_size=100)
    
    # Invalid values (outside range)
    with pytest.raises(ValidationError):
        Settings(database_pool_size=0)
    
    with pytest.raises(ValidationError):
        Settings(database_pool_size=101)


def test_confidence_threshold_range():
    """Test model confidence threshold is within valid range"""
    # Valid values
    Settings(model_confidence_threshold=0.0)
    Settings(model_confidence_threshold=0.7)
    Settings(model_confidence_threshold=1.0)
    
    # Invalid values
    with pytest.raises(ValidationError):
        Settings(model_confidence_threshold=-0.1)
    
    with pytest.raises(ValidationError):
        Settings(model_confidence_threshold=1.1)


def test_helper_properties():
    """Test helper property methods"""
    # Development environment
    dev_settings = Settings(environment="development")
    assert dev_settings.is_development is True
    assert dev_settings.is_production is False
    
    # Production environment
    prod_settings = Settings(environment="production")
    assert prod_settings.is_production is True
    assert prod_settings.is_development is False


def test_max_upload_size_mb():
    """Test max upload size conversion to MB"""
    settings = Settings(max_upload_size=10485760)  # 10MB
    assert settings.max_upload_size_mb == 10.0


def test_database_url_sync():
    """Test synchronous database URL generation"""
    settings = Settings(database_url="postgresql+asyncpg://user:pass@localhost:5432/db")
    assert settings.database_url_sync == "postgresql://user:pass@localhost:5432/db"

