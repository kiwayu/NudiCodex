# Logging Guide - NudibranchID.io Backend

## Overview

The application uses **structlog** for structured logging with:
- JSON output for production
- Pretty console output for development
- Correlation IDs for request tracing
- Different log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- Environment-specific configurations

## 🔧 Configuration

### Log Levels

Configured via environment variable:
```env
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
```

### Log Format

```env
LOG_FORMAT=json     # Production (JSON)
LOG_FORMAT=console  # Development (Pretty console)
```

### Development vs Production

**Development:**
- Pretty console output with colors
- All log levels visible
- Detailed stack traces
- Human-readable format

**Production:**
- JSON output for log aggregation
- Structured fields for parsing
- Correlation IDs for tracing
- Automatic debug log filtering

## 📝 Usage Examples

### Basic Logging

```python
from app.core import get_logger

logger = get_logger(__name__)

# Simple log
logger.info("user_logged_in")

# Log with context
logger.info("user_logged_in", user_id=123, email="user@example.com")

# Warning
logger.warning("rate_limit_approaching", user_id=123, requests=95)

# Error with exception
try:
    result = 1 / 0
except Exception as e:
    logger.error("calculation_failed", error=str(e), exc_info=True)
```

### In API Endpoints

```python
from fastapi import APIRouter
from app.core import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.post("/identify")
async def identify_image(file: UploadFile):
    logger.info("image_upload_started", filename=file.filename, size=file.size)
    
    try:
        result = await process_image(file)
        logger.info(
            "image_identified",
            species=result.species_name,
            confidence=result.confidence,
            processing_time_ms=result.duration,
        )
        return result
    except Exception as e:
        logger.error(
            "image_processing_failed",
            filename=file.filename,
            error=str(e),
            error_type=type(e).__name__,
            exc_info=True,
        )
        raise
```

### With User Context

```python
from app.core import get_logger

logger = get_logger(__name__)

async def create_user(user_data: dict):
    logger.info("user_creation_started", email=user_data["email"])
    
    # Create user...
    
    logger.info(
        "user_created",
        user_id=new_user.id,
        email=new_user.email,
        role=new_user.role,
    )
```

### Performance Logging

```python
import time
from app.core import get_logger

logger = get_logger(__name__)

def expensive_operation():
    start_time = time.time()
    
    # Do work...
    
    duration = time.time() - start_time
    logger.info(
        "operation_completed",
        operation="data_processing",
        duration_ms=round(duration * 1000, 2),
        items_processed=1000,
    )
```

## 🔍 Correlation IDs

### What are Correlation IDs?

Correlation IDs are unique identifiers that trace a request through the entire system:
- Generated for each request
- Included in all log entries for that request
- Returned in response headers
- Can be provided by clients

### How They Work

1. **Client sends request**
   ```
   GET /api/v1/species
   ```

2. **Server generates correlation ID**
   ```
   X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000
   ```

3. **All logs include correlation ID**
   ```json
   {
     "correlation_id": "550e8400-e29b-41d4-a716-446655440000",
     "event": "request_started",
     "method": "GET",
     "path": "/api/v1/species"
   }
   ```

4. **Response includes correlation ID**
   ```
   X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000
   ```

### Client Providing Correlation ID

Clients can provide their own correlation ID:

```bash
curl -H "X-Correlation-ID: my-custom-id-123" \
     http://localhost:8000/api/v1/species
```

### Accessing Correlation ID in Code

```python
from app.core.logging_config import get_correlation_id

# Get current request's correlation ID
correlation_id = get_correlation_id()
print(f"Processing request: {correlation_id}")
```

## 📊 Log Output Examples

### Development (Console Format)

```
2024-10-21 13:45:23 [info     ] request_started           correlation_id=550e8400-e29b-41d4-a716-446655440000
                                                          method=GET
                                                          path=/api/v1/species
                                                          app=NudibranchID.io API
                                                          environment=development
                                                          
2024-10-21 13:45:24 [info     ] database_query_started    correlation_id=550e8400-e29b-41d4-a716-446655440000
                                                          table=species
                                                          
2024-10-21 13:45:24 [info     ] request_completed         correlation_id=550e8400-e29b-41d4-a716-446655440000
                                                          status_code=200
                                                          duration_ms=145.23
```

### Production (JSON Format)

```json
{
  "event": "request_started",
  "level": "info",
  "timestamp": "2024-10-21T13:45:23.123456Z",
  "correlation_id": "550e8400-e29b-41d4-a716-446655440000",
  "method": "GET",
  "path": "/api/v1/species",
  "app": "NudibranchID.io API",
  "environment": "production",
  "version": "1.0.0"
}

{
  "event": "database_query_started",
  "level": "info",
  "timestamp": "2024-10-21T13:45:23.456789Z",
  "correlation_id": "550e8400-e29b-41d4-a716-446655440000",
  "table": "species",
  "app": "NudibranchID.io API",
  "environment": "production",
  "version": "1.0.0"
}

{
  "event": "request_completed",
  "level": "info",
  "timestamp": "2024-10-21T13:45:24.567890Z",
  "correlation_id": "550e8400-e29b-41d4-a716-446655440000",
  "status_code": 200,
  "duration_ms": 145.23,
  "app": "NudibranchID.io API",
  "environment": "production",
  "version": "1.0.0"
}
```

## 🎯 Log Levels

### DEBUG
```python
logger.debug("cache_hit", key="species:123", ttl=300)
```
Use for: Development diagnostics, cache hits, detailed flow

### INFO
```python
logger.info("user_login", user_id=123, ip="192.168.1.1")
```
Use for: Normal operations, user actions, system events

### WARNING
```python
logger.warning("slow_query", query_time_ms=5000, table="species")
```
Use for: Degraded performance, deprecated features, recoverable errors

### ERROR
```python
logger.error("database_connection_failed", error=str(e), exc_info=True)
```
Use for: Errors, exceptions, failures that need attention

### CRITICAL
```python
logger.critical("system_failure", service="database", action="shutting_down")
```
Use for: System failures, data corruption, security breaches

## 🔧 Middleware

### Correlation ID Middleware

Automatically adds correlation IDs to all requests:

```python
from app.core.middleware import CorrelationIdMiddleware

app.add_middleware(CorrelationIdMiddleware)
```

### Logging Middleware

Logs all requests and responses:

```python
from app.core.middleware import LoggingMiddleware

app.add_middleware(LoggingMiddleware)
```

### Security Headers Middleware

Adds security headers to responses:

```python
from app.core.middleware import SecurityHeadersMiddleware

app.add_middleware(SecurityHeadersMiddleware)
```

## 🧪 Testing Logging

### Test Endpoints

```bash
# Test different log levels
curl http://localhost:8000/test-logging

# Test error logging
curl http://localhost:8000/test-error
```

### Check Logs

**Console (Development):**
See output in terminal

**JSON (Production):**
```bash
# View logs
tail -f logs/app.log

# Search by correlation ID
grep "550e8400" logs/app.log | jq

# Filter by level
jq 'select(.level == "error")' logs/app.log

# Count errors
jq 'select(.level == "error")' logs/app.log | wc -l
```

## 📈 Log Aggregation

### ELK Stack

```json
{
  "event": "user_login",
  "level": "info",
  "correlation_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": 123,
  "ip": "192.168.1.1"
}
```

Query in Kibana:
```
correlation_id: "550e8400-e29b-41d4-a716-446655440000"
```

### CloudWatch

Filter pattern:
```
{ $.correlation_id = "550e8400-e29b-41d4-a716-446655440000" }
```

### Datadog

Search:
```
@correlation_id:550e8400-e29b-41d4-a716-446655440000
```

## 🎨 Best Practices

### 1. Use Structured Logging
```python
# ✅ Good - Structured
logger.info("user_action", action="login", user_id=123, success=True)

# ❌ Bad - Unstructured
logger.info(f"User 123 logged in successfully")
```

### 2. Include Context
```python
# ✅ Good - Context included
logger.error(
    "payment_failed",
    user_id=user.id,
    amount=order.total,
    payment_method="stripe",
    error=str(e),
    exc_info=True,
)

# ❌ Bad - No context
logger.error("Payment failed")
```

### 3. Use Appropriate Levels
```python
# ✅ Good
logger.debug("cache_lookup", key="user:123")      # DEBUG
logger.info("user_created", user_id=123)          # INFO
logger.warning("api_quota_low", remaining=10)     # WARNING
logger.error("api_call_failed", error=str(e))     # ERROR

# ❌ Bad
logger.info("CRITICAL DATABASE FAILURE!")  # Should be ERROR or CRITICAL
```

### 4. Log Exceptions Properly
```python
# ✅ Good
try:
    process_data()
except Exception as e:
    logger.error("processing_failed", error=str(e), exc_info=True)

# ❌ Bad
try:
    process_data()
except Exception as e:
    logger.error(str(e))  # Loses stack trace
```

### 5. Don't Log Sensitive Data
```python
# ✅ Good
logger.info("user_login", user_id=user.id, email_domain=email.split('@')[1])

# ❌ Bad
logger.info("user_login", password=password, api_key=api_key)
```

## 🔒 Security Considerations

### Don't Log:
- ❌ Passwords
- ❌ API keys
- ❌ Tokens
- ❌ Credit card numbers
- ❌ Personal identifiable information (PII)
- ❌ Session IDs

### Do Log:
- ✅ User IDs (hashed if needed)
- ✅ Email domains (not full emails)
- ✅ IP addresses (check regulations)
- ✅ Request paths
- ✅ Error messages
- ✅ Performance metrics

## 📚 Additional Resources

- [Structlog Documentation](https://www.structlog.org/)
- [Twelve-Factor App Logs](https://12factor.net/logs)
- [Python Logging Best Practices](https://docs.python.org/3/howto/logging.html)

## 🐛 Troubleshooting

### Logs Not Appearing

Check log level:
```env
LOG_LEVEL=DEBUG  # Show all logs
```

### JSON Not Formatted

Set log format:
```env
LOG_FORMAT=json
```

### Correlation ID Missing

Ensure middleware is added:
```python
app.add_middleware(CorrelationIdMiddleware)
```

### Too Many Logs

Increase log level:
```env
LOG_LEVEL=WARNING  # Only warnings and errors
```

