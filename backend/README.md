# NudibranchID.io Backend

FastAPI-based backend service for nudibranch species identification using machine learning.

## 🛠️ Tech Stack

- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - Async ORM for database operations
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **TensorFlow** - Machine learning models
- **Alembic** - Database migrations
- **Poetry** - Dependency management

## 📋 Prerequisites

- **Python 3.11+**
- **Poetry** - [Installation guide](https://python-poetry.org/docs/#installation)
- **PostgreSQL** (or use Docker)
- **Redis** (or use Docker)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Poetry if not already installed
curl -sSL https://install.python-poetry.org | python3 -

# Install project dependencies
make install
```

### 2. Set up Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run Development Server

```bash
make run-dev
```

The API will be available at http://localhost:8000

## 📝 Makefile Commands

The project includes a comprehensive Makefile for common tasks:

```bash
make help              # Show all available commands

# Development
make install          # Install dependencies and pre-commit hooks
make run-dev         # Start development server with auto-reload
make run-prod        # Start production server

# Code Quality
make format          # Format code with black and ruff
make lint            # Run linting with ruff and mypy
make format-check    # Check formatting without changes
make pre-commit      # Run pre-commit hooks manually
make check           # Run all checks (format, lint, test)

# Testing
make test            # Run tests with coverage
make test-fast       # Run tests without coverage

# Database
make db-init         # Initialize Alembic
make db-migrate      # Create new migration
make db-upgrade      # Apply migrations
make db-downgrade    # Rollback last migration
make db-reset        # Reset database

# Docker
make docker-up       # Start all Docker services
make docker-down     # Stop Docker services
make docker-build    # Build Docker images
make docker-logs     # View Docker logs

# Utilities
make clean           # Clean cache and temporary files
make clean-all       # Clean everything including venv
make deps-update     # Update dependencies
make deps-show       # Show installed dependencies
make shell           # Open Poetry shell

# CI/CD
make ci              # Run CI pipeline (format-check, lint, test)
```

## 📚 API Documentation

Once the server is running, interactive API documentation is available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🏗️ Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── pyproject.toml          # Poetry dependencies and config
├── Makefile               # Development automation
├── .pre-commit-config.yaml # Pre-commit hooks
├── .env.example           # Environment variables template
├── alembic/               # Database migrations
├── app/
│   ├── api/              # API routes
│   ├── core/             # Core functionality (config, security)
│   ├── db/               # Database models and sessions
│   ├── models/           # Pydantic models
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
└── tests/                # Test suite
    ├── api/              # API tests
    ├── services/         # Service tests
    └── conftest.py       # Pytest configuration
```

## 🔧 Development

### Poetry Usage

```bash
# Add a new dependency
poetry add package-name

# Add a dev dependency
poetry add --group dev package-name

# Update dependencies
poetry update

# Show installed packages
poetry show

# Open a shell with the virtual environment activated
poetry shell
```

### Pre-commit Hooks

Pre-commit hooks are automatically installed with `make install`. They will:
- Format code with Black
- Lint with Ruff
- Type-check with mypy
- Check for common issues

To run manually:
```bash
make pre-commit
```

### Code Style

- **Line length**: 100 characters
- **Formatter**: Black
- **Linter**: Ruff
- **Type checker**: mypy (strict mode)

### Testing

```bash
# Run all tests with coverage
make test

# Run specific test file
poetry run pytest tests/test_example.py

# Run tests matching a pattern
poetry run pytest -k "test_pattern"

# Run with verbose output
poetry run pytest -v
```

### Database Migrations

```bash
# Initialize Alembic (first time only)
make db-init

# Create a new migration
make db-migrate
# You'll be prompted for a migration message

# Apply migrations
make db-upgrade

# Rollback last migration
make db-downgrade

# Reset database (careful in production!)
make db-reset
```

## 🐳 Docker Development

```bash
# Start all services (backend, frontend, database, redis)
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down
```

## 🔒 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/nudibranchid

# Redis
REDIS_URL=redis://localhost:6379/0

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ML Model
MODEL_PATH=../data/models/nudibranch_classifier.h5
MODEL_VERSION=1.0.0

# File Upload
MAX_UPLOAD_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=jpg,jpeg,png,webp

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📊 Logging

The application uses `structlog` for structured logging:

```python
import structlog

logger = structlog.get_logger()

logger.info("user_action", user_id=123, action="upload_image")
logger.error("processing_failed", error=str(e), image_id=456)
```

## 🧪 Testing Strategy

- **Unit tests**: Test individual functions and methods
- **Integration tests**: Test API endpoints and database operations
- **Async tests**: Use `pytest-asyncio` for async code
- **Coverage target**: 80%+

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG=False` in environment
- [ ] Use strong `SECRET_KEY`
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Use HTTPS/TLS
- [ ] Set resource limits
- [ ] Configure health checks

### Running in Production

```bash
# Using the Makefile
make run-prod

# Or directly with Poetry
poetry run uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📖 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Poetry Documentation](https://python-poetry.org/docs/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `make check` to ensure all tests pass
4. Submit a pull request

## 📄 License

[Your License Here]
