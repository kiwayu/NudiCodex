.PHONY: install test lint format run-dev db-migrate docker-up clean help

# Default target
.DEFAULT_GOAL := help

# Variables
PYTHON := python
POETRY := poetry
DOCKER_COMPOSE := docker-compose

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies with Poetry
	$(POETRY) install
	$(POETRY) run pre-commit install
	@echo "✅ Dependencies installed and pre-commit hooks set up"

install-poetry: ## Install Poetry (if not already installed)
	@echo "Installing Poetry..."
	curl -sSL https://install.python-poetry.org | $(PYTHON) -
	@echo "✅ Poetry installed. Add it to your PATH if needed"

test: ## Run tests with pytest
	$(POETRY) run pytest -v --cov=. --cov-report=term-missing --cov-report=html
	@echo "✅ Tests completed. Coverage report available in htmlcov/"

test-fast: ## Run tests without coverage
	$(POETRY) run pytest -v
	@echo "✅ Fast tests completed"

lint: ## Run linting with ruff and mypy
	@echo "Running ruff..."
	$(POETRY) run ruff check .
	@echo "Running mypy..."
	$(POETRY) run mypy .
	@echo "✅ Linting completed"

format: ## Format code with black and ruff
	@echo "Formatting with black..."
	$(POETRY) run black .
	@echo "Auto-fixing with ruff..."
	$(POETRY) run ruff check --fix .
	@echo "✅ Code formatted"

format-check: ## Check code formatting without making changes
	$(POETRY) run black --check .
	$(POETRY) run ruff check .
	@echo "✅ Format check completed"

run-dev: ## Run development server with uvicorn
	$(POETRY) run uvicorn main:app --reload --host 0.0.0.0 --port 8000

run-prod: ## Run production server
	$(POETRY) run uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

db-init: ## Initialize database with Alembic
	$(POETRY) run alembic init alembic
	@echo "✅ Alembic initialized. Edit alembic.ini and alembic/env.py"

db-migrate: ## Create a new database migration
	@read -p "Enter migration message: " msg; \
	$(POETRY) run alembic revision --autogenerate -m "$$msg"
	@echo "✅ Migration created"

db-upgrade: ## Apply database migrations
	$(POETRY) run alembic upgrade head
	@echo "✅ Database upgraded to latest migration"

db-downgrade: ## Rollback last database migration
	$(POETRY) run alembic downgrade -1
	@echo "✅ Database downgraded one revision"

db-reset: ## Reset database (downgrade all, then upgrade all)
	$(POETRY) run alembic downgrade base
	$(POETRY) run alembic upgrade head
	@echo "✅ Database reset"

docker-up: ## Start all Docker services
	cd ../infrastructure && $(DOCKER_COMPOSE) up -d
	@echo "✅ Docker services started"

docker-down: ## Stop all Docker services
	cd ../infrastructure && $(DOCKER_COMPOSE) down
	@echo "✅ Docker services stopped"

docker-build: ## Build Docker images
	cd ../infrastructure && $(DOCKER_COMPOSE) build
	@echo "✅ Docker images built"

docker-logs: ## View Docker logs
	cd ../infrastructure && $(DOCKER_COMPOSE) logs -f

pre-commit: ## Run pre-commit hooks on all files
	$(POETRY) run pre-commit run --all-files
	@echo "✅ Pre-commit hooks executed"

clean: ## Clean up cache and temporary files
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name ".coverage" -delete
	@echo "✅ Cleaned up cache and temporary files"

clean-all: clean ## Clean everything including poetry virtualenv
	$(POETRY) env remove --all
	@echo "✅ All cleaned including virtual environments"

deps-update: ## Update dependencies to latest versions
	$(POETRY) update
	@echo "✅ Dependencies updated"

deps-show: ## Show installed dependencies
	$(POETRY) show

shell: ## Open a Poetry shell
	$(POETRY) shell

check: format-check lint test ## Run all checks (format, lint, test)
	@echo "✅ All checks passed!"

dev: install run-dev ## Install dependencies and start dev server

# CI/CD targets
ci: format-check lint test ## Run CI pipeline
	@echo "✅ CI pipeline completed successfully"

