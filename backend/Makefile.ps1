# PowerShell Makefile alternative for Windows
# Usage: .\Makefile.ps1 <command>

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

$POETRY = "poetry"
$DOCKER_COMPOSE = "docker-compose"

function Show-Help {
    Write-Host "Usage: .\Makefile.ps1 <command>" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Green
    Write-Host "  install          - Install dependencies with Poetry"
    Write-Host "  test             - Run tests with pytest"
    Write-Host "  test-fast        - Run tests without coverage"
    Write-Host "  lint             - Run linting with ruff and mypy"
    Write-Host "  format           - Format code with black and ruff"
    Write-Host "  format-check     - Check code formatting"
    Write-Host "  run-dev          - Run development server"
    Write-Host "  run-prod         - Run production server"
    Write-Host "  db-migrate       - Create database migration"
    Write-Host "  db-upgrade       - Apply database migrations"
    Write-Host "  db-downgrade     - Rollback last migration"
    Write-Host "  docker-up        - Start Docker services"
    Write-Host "  docker-down      - Stop Docker services"
    Write-Host "  docker-build     - Build Docker images"
    Write-Host "  pre-commit       - Run pre-commit hooks"
    Write-Host "  clean            - Clean cache and temp files"
    Write-Host "  check            - Run all checks"
}

switch ($Command) {
    "install" {
        & $POETRY install
        & $POETRY run pre-commit install
        Write-Host "✅ Dependencies installed" -ForegroundColor Green
    }
    "test" {
        & $POETRY run pytest -v --cov=. --cov-report=term-missing --cov-report=html
        Write-Host "✅ Tests completed" -ForegroundColor Green
    }
    "test-fast" {
        & $POETRY run pytest -v
        Write-Host "✅ Fast tests completed" -ForegroundColor Green
    }
    "lint" {
        Write-Host "Running ruff..." -ForegroundColor Cyan
        & $POETRY run ruff check .
        Write-Host "Running mypy..." -ForegroundColor Cyan
        & $POETRY run mypy .
        Write-Host "✅ Linting completed" -ForegroundColor Green
    }
    "format" {
        Write-Host "Formatting with black..." -ForegroundColor Cyan
        & $POETRY run black .
        Write-Host "Auto-fixing with ruff..." -ForegroundColor Cyan
        & $POETRY run ruff check --fix .
        Write-Host "✅ Code formatted" -ForegroundColor Green
    }
    "format-check" {
        & $POETRY run black --check .
        & $POETRY run ruff check .
        Write-Host "✅ Format check completed" -ForegroundColor Green
    }
    "run-dev" {
        & $POETRY run uvicorn main:app --reload --host 0.0.0.0 --port 8000
    }
    "run-prod" {
        & $POETRY run uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
    }
    "db-migrate" {
        $msg = Read-Host "Enter migration message"
        & $POETRY run alembic revision --autogenerate -m $msg
        Write-Host "✅ Migration created" -ForegroundColor Green
    }
    "db-upgrade" {
        & $POETRY run alembic upgrade head
        Write-Host "✅ Database upgraded" -ForegroundColor Green
    }
    "db-downgrade" {
        & $POETRY run alembic downgrade -1
        Write-Host "✅ Database downgraded" -ForegroundColor Green
    }
    "docker-up" {
        Set-Location ../infrastructure
        & $DOCKER_COMPOSE up -d
        Set-Location ../backend
        Write-Host "✅ Docker services started" -ForegroundColor Green
    }
    "docker-down" {
        Set-Location ../infrastructure
        & $DOCKER_COMPOSE down
        Set-Location ../backend
        Write-Host "✅ Docker services stopped" -ForegroundColor Green
    }
    "docker-build" {
        Set-Location ../infrastructure
        & $DOCKER_COMPOSE build
        Set-Location ../backend
        Write-Host "✅ Docker images built" -ForegroundColor Green
    }
    "pre-commit" {
        & $POETRY run pre-commit run --all-files
        Write-Host "✅ Pre-commit hooks executed" -ForegroundColor Green
    }
    "clean" {
        Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
        Get-ChildItem -Path . -Recurse -File -Filter "*.pyc" | Remove-Item -Force
        Get-ChildItem -Path . -Recurse -Directory -Filter ".pytest_cache" | Remove-Item -Recurse -Force
        Get-ChildItem -Path . -Recurse -Directory -Filter ".mypy_cache" | Remove-Item -Recurse -Force
        Get-ChildItem -Path . -Recurse -Directory -Filter ".ruff_cache" | Remove-Item -Recurse -Force
        Write-Host "✅ Cleaned up cache files" -ForegroundColor Green
    }
    "check" {
        .\Makefile.ps1 format-check
        .\Makefile.ps1 lint
        .\Makefile.ps1 test
        Write-Host "✅ All checks passed!" -ForegroundColor Green
    }
    default {
        Show-Help
    }
}

