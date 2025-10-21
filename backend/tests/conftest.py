"""
Pytest configuration and fixtures for NudibranchID.io backend tests
"""

import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI application"""
    return TestClient(app)


@pytest.fixture
def sample_image_data():
    """Sample image data for testing uploads"""
    return {
        "filename": "test_nudibranch.jpg",
        "content_type": "image/jpeg",
        "size": 1024,
    }


# Add more fixtures as needed for database, authentication, etc.

