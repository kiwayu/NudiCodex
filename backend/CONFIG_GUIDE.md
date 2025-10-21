# Configuration Guide - NudibranchID.io Backend

## Overview

The backend uses a comprehensive configuration system built with `pydantic-settings` for type-safe, validated settings management.

## 🔧 Configuration System

### Architecture

```
app/core/config.py
├── Settings class (BaseSettings)
├── Field validators
├── Helper properties
└── Singleton pattern (@lru_cache)
```

### Key Features

✅ **Type Safety** - All settings are type-checked with Pydantic  
✅ **Validation** - Field validators ensure data integrity  
✅ **Environment Variables** - Loads from `.env` file  
✅ **Singleton Pattern** - Single settings instance via `@lru_cache`  
✅ **Helper Properties** - Computed properties for convenience  
✅ **Production Ready** - Comprehensive security and feature flags  

## 📝 Configuration Categories

### 1. Application Info
```python
PROJECT_NAME=NudibranchID.io API
API_VERSION=1.0.0
ENVIRONMENT=development  # development, staging, production
DEBUG=True
```

### 2. Database (PostgreSQL)
```python
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/nudibranchid
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20
DATABASE_POOL_TIMEOUT=30
```

**Validation:**
- Must start with `postgresql://` or `postgresql+asyncpg://`
- Pool size: 1-100
- Max overflow: 0-100

### 3. Redis
```python
REDIS_URL=redis://localhost:6379/0
REDIS_CACHE_TTL=300  # 5 minutes
REDIS_SESSION_TTL=86400  # 24 hours
REDIS_ENABLED=True
```

**Validation:**
- Must start with `redis://` or `rediss://`
- Connection limits: 1-100

### 4. CORS
```python
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
CORS_ALLOW_CREDENTIALS=True
CORS_MAX_AGE=600
```

### 5. Rate Limiting
```python
RATE_LIMIT_ENABLED=True
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
RATE_LIMIT_PER_DAY=10000
```

### 6. ML Model Configuration
```python
MODEL_PATH=../data/models/nudibranch_classifier.h5
MODEL_INPUT_SIZE=224  # 224x224 images
MODEL_CONFIDENCE_THRESHOLD=0.7
MODEL_TOP_K=5  # Top 5 predictions
MODEL_USE_GPU=True
MODEL_WARMUP_ON_STARTUP=True
```

**Validation:**
- Input size: >= 32
- Confidence: 0.0-1.0
- Top K: 1-20

### 7. File Upload
```python
MAX_UPLOAD_SIZE=10485760  # 10MB
ALLOWED_IMAGE_EXTENSIONS=["jpg","jpeg","png","webp"]
THUMBNAIL_SIZE=256
```

**Constraints:**
- Max size: >= 1024 bytes
- Allowed: jpg, jpeg, png, webp only

### 8. Storage (S3/MinIO)
```python
STORAGE_BACKEND=local  # local, s3, minio

# S3/MinIO settings
S3_ENDPOINT_URL=http://localhost:9000
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=nudibranchid-images
```

**Validation:**
- Endpoint must start with `http://` or `https://`

### 9. Security (JWT)
```python
SECRET_KEY=use-openssl-rand-hex-32-to-generate
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Password Policy
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=True
PASSWORD_REQUIRE_DIGITS=True
BCRYPT_ROUNDS=12
```

### 10. Logging
```python
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_FORMAT=json  # json, console
LOG_FILE=logs/app.log
LOG_ROTATION=20 MB
LOG_RETENTION=30 days
```

### 11. Feature Flags
```python
ENABLE_ANALYTICS=False
ENABLE_FEEDBACK=True
ENABLE_USER_ACCOUNTS=True
ENABLE_REGISTRATION=True
ENABLE_SPECIES_SUGGESTIONS=True
ENABLE_ADMIN_PANEL=True
ENABLE_SWAGGER_UI=True
```

## 🚀 Usage

### Basic Usage

```python
from app.core import settings

# Access settings
print(settings.database_url)
print(settings.model_confidence_threshold)
print(settings.max_upload_size_mb)  # Helper property
```

### In FastAPI Endpoints

```python
from fastapi import APIRouter
from app.core import settings

router = APIRouter()

@router.get("/info")
async def get_info():
    return {
        "max_upload_mb": settings.max_upload_size_mb,
        "model_version": settings.model_version,
        "environment": settings.environment,
    }
```

### Using Singleton Pattern

```python
from app.core.config import get_settings

# Always returns the same instance
settings = get_settings()
```

### Helper Properties

```python
# Check environment
if settings.is_production:
    # Production-specific code
    pass

if settings.is_development:
    # Development-specific code
    pass

# Get upload size in MB
max_mb = settings.max_upload_size_mb

# Get sync database URL (for Alembic)
sync_url = settings.database_url_sync
```

## 🔐 Security Best Practices

### Production Checklist

Before deploying to production:

1. **Generate Secure Secret Key**
   ```bash
   openssl rand -hex 32
   ```
   Update `SECRET_KEY` in `.env`

2. **Update Environment**
   ```env
   ENVIRONMENT=production
   DEBUG=False
   ```

3. **Configure CORS**
   ```env
   CORS_ORIGINS=["https://yourdomain.com"]
   ```

4. **Secure Database**
   - Use strong credentials
   - Enable SSL/TLS
   - Restrict network access

5. **Enable Security Features**
   ```env
   RATE_LIMIT_ENABLED=True
   PASSWORD_REQUIRE_UPPERCASE=True
   PASSWORD_REQUIRE_DIGITS=True
   ```

6. **Configure Monitoring**
   ```env
   SENTRY_DSN=your-sentry-dsn
   ENABLE_METRICS=True
   ```

## 🧪 Testing

### Test Configuration

```python
from app.core.config import Settings

def test_custom_settings():
    # Create settings with custom values
    settings = Settings(
        database_url="postgresql://test:test@localhost:5432/test",
        redis_enabled=False,
        debug=True,
    )
    
    assert settings.debug is True
    assert settings.redis_enabled is False
```

### Validation Testing

```python
import pytest
from pydantic import ValidationError

def test_invalid_database_url():
    with pytest.raises(ValidationError):
        Settings(database_url="mysql://invalid")

def test_confidence_threshold_range():
    with pytest.raises(ValidationError):
        Settings(model_confidence_threshold=1.5)  # > 1.0
```

## 📊 Environment-Specific Configurations

### Development
```env
ENVIRONMENT=development
DEBUG=True
LOG_LEVEL=DEBUG
LOG_FORMAT=console
ENABLE_SWAGGER_UI=True
MODEL_WARMUP_ON_STARTUP=False
```

### Staging
```env
ENVIRONMENT=staging
DEBUG=False
LOG_LEVEL=INFO
LOG_FORMAT=json
ENABLE_SWAGGER_UI=True
MODEL_WARMUP_ON_STARTUP=True
```

### Production
```env
ENVIRONMENT=production
DEBUG=False
LOG_LEVEL=WARNING
LOG_FORMAT=json
ENABLE_SWAGGER_UI=False
MODEL_WARMUP_ON_STARTUP=True
RATE_LIMIT_ENABLED=True
```

## 🔄 Dynamic Configuration

### Reload Settings

Settings are cached using `@lru_cache`. To reload:

```python
from app.core.config import get_settings

# Clear cache
get_settings.cache_clear()

# Get fresh settings
settings = get_settings()
```

### Override Settings in Tests

```python
from unittest.mock import patch

def test_with_custom_settings():
    with patch('app.core.config.Settings') as mock_settings:
        mock_settings.return_value.debug = True
        # Test code here
```

## 📝 Adding New Settings

1. **Add to Settings Class**
   ```python
   class Settings(BaseSettings):
       new_feature_enabled: bool = Field(default=False)
   ```

2. **Add Validation (if needed)**
   ```python
   @field_validator("new_feature_enabled")
   @classmethod
   def validate_new_feature(cls, v: bool) -> bool:
       # Custom validation
       return v
   ```

3. **Add to .env.example**
   ```env
   NEW_FEATURE_ENABLED=False
   ```

4. **Document in this guide**

## 🐛 Troubleshooting

### Settings Not Loading

```python
# Check if .env file exists
import os
assert os.path.exists('.env'), ".env file not found"

# Check environment variable
import os
print(os.getenv('DATABASE_URL'))
```

### Validation Errors

```python
from pydantic import ValidationError

try:
    settings = Settings()
except ValidationError as e:
    print(e.json())  # Detailed error information
```

### Type Errors

```python
# Enable debug mode to see detailed errors
DEBUG=True
LOG_LEVEL=DEBUG
```

## 📚 Additional Resources

- [Pydantic Settings Documentation](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- [FastAPI Settings Management](https://fastapi.tiangolo.com/advanced/settings/)
- [12-Factor App Config](https://12factor.net/config)

## 🎯 Quick Reference

### Common Settings Access

```python
from app.core import settings

# Database
settings.database_url
settings.database_pool_size

# Redis
settings.redis_url
settings.redis_cache_ttl

# Model
settings.model_path
settings.model_confidence_threshold
settings.model_top_k

# Upload
settings.max_upload_size_mb
settings.allowed_image_extensions

# Security
settings.secret_key
settings.access_token_expire_minutes

# Feature Flags
settings.enable_user_accounts
settings.enable_analytics
settings.enable_feedback
```

### Validation Examples

```python
# Database URL: Must be PostgreSQL
✓ postgresql://user:pass@host:5432/db
✓ postgresql+asyncpg://user:pass@host:5432/db
✗ mysql://user:pass@host:3306/db

# Redis URL: Must be Redis
✓ redis://localhost:6379/0
✓ rediss://localhost:6379/0
✗ http://localhost:6379

# Confidence Threshold: 0.0 to 1.0
✓ 0.7
✓ 0.0
✓ 1.0
✗ 1.5
✗ -0.1

# Pool Size: 1 to 100
✓ 10
✓ 1
✓ 100
✗ 0
✗ 101
```

