"""
Tests for main application endpoints
"""

import pytest
from fastapi.testclient import TestClient


def test_read_root(client: TestClient):
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Welcome to NudibranchID.io API"
    assert data["version"] == "1.0.0"
    assert data["status"] == "operational"


def test_health_check(client: TestClient):
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

