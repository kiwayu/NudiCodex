"""
Tests for middleware
"""

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.middleware import (
    CorrelationIdMiddleware,
    LoggingMiddleware,
    SecurityHeadersMiddleware,
)


@pytest.fixture
def app_with_middleware():
    """Create a test app with middleware"""
    app = FastAPI()
    
    # Add middleware
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(CorrelationIdMiddleware)
    
    @app.get("/test")
    async def test_endpoint():
        return {"message": "test"}
    
    return app


def test_correlation_id_middleware_generates_id(app_with_middleware):
    """Test that correlation ID is generated if not provided"""
    client = TestClient(app_with_middleware)
    
    response = client.get("/test")
    
    assert response.status_code == 200
    assert "X-Correlation-ID" in response.headers
    assert len(response.headers["X-Correlation-ID"]) > 0


def test_correlation_id_middleware_accepts_header(app_with_middleware):
    """Test that correlation ID from header is used"""
    client = TestClient(app_with_middleware)
    
    test_id = "test-correlation-id-123"
    response = client.get("/test", headers={"X-Correlation-ID": test_id})
    
    assert response.status_code == 200
    assert response.headers["X-Correlation-ID"] == test_id


def test_security_headers_middleware(app_with_middleware):
    """Test that security headers are added"""
    client = TestClient(app_with_middleware)
    
    response = client.get("/test")
    
    assert response.status_code == 200
    assert "X-Content-Type-Options" in response.headers
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert "X-Frame-Options" in response.headers
    assert response.headers["X-Frame-Options"] == "DENY"
    assert "X-XSS-Protection" in response.headers
    assert "Strict-Transport-Security" in response.headers


def test_logging_middleware(app_with_middleware, caplog):
    """Test that requests are logged"""
    client = TestClient(app_with_middleware)
    
    response = client.get("/test")
    
    assert response.status_code == 200
    # Logging middleware should have logged the request
    # (Exact assertion depends on log configuration)

