# Backend Setup Guide

Complete guide to setting up the NudibranchID.io backend.

## 📦 Installation

### Step 1: Install Poetry

Poetry is required for dependency management. Install it using one of these methods:

**macOS/Linux/WSL:**
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

**Windows (PowerShell):**
```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

Add Poetry to your PATH:
- **macOS/Linux**: `export PATH="$HOME/.local/bin:$PATH"`
- **Windows**: Add `%APPDATA%\Python\Scripts` to PATH

Verify installation:
```bash
poetry --version
```

### Step 2: Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all dependencies (including dev dependencies)
poetry install

# Or use the Makefile
make install
```

This will:
- Create a virtual environment
- Install all Python packages
- Set up pre-commit hooks

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings
# At minimum, update:
# - SECRET_KEY (generate with: openssl rand -hex 32)
# - DATABASE_URL
# - REDIS_URL
```

### Step 4: Set up Database (Optional for Docker)

If not using Docker:

```bash
# Install PostgreSQL and Redis locally
# Then run migrations
make db-init
make db-upgrade
```

## 🚀 Running the Application

### Development Mode

```bash
# Using Makefile (recommended)
make run-dev

# Or using Poetry directly
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Using Docker

```bash
# Start all services (backend, frontend, database, redis)
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down
```

## 🧪 Running Tests

```bash
# Run all tests with coverage
make test

# Run specific test file
poetry run pytest tests/test_main.py

# Run with verbose output
poetry run pytest -v

# Watch mode (requires pytest-watch)
poetry run ptw
```

## 🎨 Code Quality

### Formatting

```bash
# Format code
make format

# Check formatting without changes
make format-check
```

### Linting

```bash
# Run linters
make lint

# Auto-fix issues
poetry run ruff check --fix .
```

### Pre-commit Hooks

Pre-commit hooks run automatically on `git commit`. To run manually:

```bash
make pre-commit
```

To skip hooks (not recommended):
```bash
git commit --no-verify
```

## 🗄️ Database Operations

### Migrations

```bash
# Initialize Alembic (first time only)
make db-init

# Create a new migration
make db-migrate
# You'll be prompted for a message

# Apply migrations
make db-upgrade

# Rollback last migration
make db-downgrade

# Reset database (careful!)
make db-reset
```

### Manual Alembic Commands

```bash
# Show current revision
poetry run alembic current

# Show migration history
poetry run alembic history

# Upgrade to specific revision
poetry run alembic upgrade <revision>

# Downgrade to specific revision
poetry run alembic downgrade <revision>
```

## 🔧 Development Workflow

### 1. Create a New Feature

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
# ...

# Run tests and checks
make check
```

### 2. Before Committing

```bash
# Format code
make format

# Run linting
make lint

# Run tests
make test

# Or run all checks at once
make check
```

### 3. Commit Changes

```bash
git add .
git commit -m "feat: your feature description"
# Pre-commit hooks will run automatically
```

## 📚 Common Tasks

### Adding Dependencies

```bash
# Add production dependency
poetry add package-name

# Add dev dependency
poetry add --group dev package-name

# Add with specific version
poetry add "package-name>=1.0.0,<2.0.0"

# Update dependencies
poetry update
```

### Environment Management

```bash
# Show virtual environment info
poetry env info

# Activate virtual environment
poetry shell

# Run command in virtual environment
poetry run python script.py

# Remove virtual environment
poetry env remove python
```

### Debugging

```bash
# Run with debugger
poetry run python -m debugpy --listen 5678 -m uvicorn main:app --reload

# View logs
tail -f logs/app.log

# Interactive Python shell
poetry run python
>>> from app.core.config import settings
>>> print(settings.database_url)
```

## 🐛 Troubleshooting

### Poetry Not Found

```bash
# Check if Poetry is in PATH
which poetry  # macOS/Linux
where poetry  # Windows

# If not, add to PATH or use full path
~/.local/bin/poetry --version
```

### Virtual Environment Issues

```bash
# Remove and recreate environment
poetry env remove --all
poetry install
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check Redis is running
redis-cli ping
# Should return: PONG
```

### Import Errors

```bash
# Ensure you're in the Poetry environment
poetry shell

# Or prefix commands with poetry run
poetry run python main.py
```

### Pre-commit Hook Failures

```bash
# Update pre-commit hooks
poetry run pre-commit autoupdate

# Clear pre-commit cache
poetry run pre-commit clean

# Reinstall hooks
poetry run pre-commit install --install-hooks
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `DEBUG=False`
- [ ] Update `CORS_ORIGINS` to specific domains
- [ ] Use strong database credentials
- [ ] Enable HTTPS/TLS
- [ ] Set up rate limiting
- [ ] Configure proper logging
- [ ] Set up monitoring and alerts
- [ ] Review and update `.env` file
- [ ] Remove any development/test credentials

## 📖 Additional Resources

- [Poetry Documentation](https://python-poetry.org/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)
- [pytest Documentation](https://docs.pytest.org/)
- [Structlog Documentation](https://www.structlog.org/)

## 🆘 Getting Help

If you encounter issues:

1. Check this SETUP.md file
2. Review the main [README.md](README.md)
3. Check existing [GitHub Issues](https://github.com/yourusername/nudibranchid-io/issues)
4. Ask in the project Discord/Slack
5. Create a new issue with detailed information

