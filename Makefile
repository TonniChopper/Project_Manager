# =============================================================================
# Project Manager - Makefile for Development & Operations
# =============================================================================
# Usage: make <target>
# Example: make help
# =============================================================================

.PHONY: help
.DEFAULT_GOAL := help

# Colors for output
COLOR_RESET = \033[0m
COLOR_BOLD = \033[1m
COLOR_GREEN = \033[32m
COLOR_YELLOW = \033[33m
COLOR_BLUE = \033[34m

# Docker Compose files
COMPOSE_FILE := infra/docker/docker-compose.yml
COMPOSE := docker-compose -f $(COMPOSE_FILE)

# =============================================================================
# Help
# =============================================================================

help: ## Show this help message
	@echo "$(COLOR_BOLD)Project Manager - Available Commands$(COLOR_RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(COLOR_GREEN)%-20s$(COLOR_RESET) %s\n", $$1, $$2}'

# =============================================================================
# Setup & Installation
# =============================================================================

setup: ## Initial project setup
	@echo "$(COLOR_BOLD)Setting up project...$(COLOR_RESET)"
	@if [ ! -f infra/docker/.env ]; then \
		echo "$(COLOR_YELLOW)Creating .env file from template...$(COLOR_RESET)"; \
		cp infra/docker/.env.example infra/docker/.env; \
		echo "$(COLOR_GREEN)✓ .env created. Please review and update values.$(COLOR_RESET)"; \
	else \
		echo "$(COLOR_YELLOW)⚠ .env already exists$(COLOR_RESET)"; \
	fi
	@echo "$(COLOR_GREEN)✓ Setup complete!$(COLOR_RESET)"

install: setup ## Install all dependencies
	@echo "$(COLOR_BOLD)Installing dependencies...$(COLOR_RESET)"
	cd backend && pip install -r requirements.txt
	@echo "$(COLOR_GREEN)✓ Dependencies installed$(COLOR_RESET)"

# =============================================================================
# Docker Operations
# =============================================================================

build: ## Build all Docker images
	@echo "$(COLOR_BOLD)Building Docker images...$(COLOR_RESET)"
	$(COMPOSE) build --parallel
	@echo "$(COLOR_GREEN)✓ Build complete$(COLOR_RESET)"

build-no-cache: ## Build Docker images without cache
	@echo "$(COLOR_BOLD)Building Docker images (no cache)...$(COLOR_RESET)"
	$(COMPOSE) build --no-cache --parallel
	@echo "$(COLOR_GREEN)✓ Build complete$(COLOR_RESET)"

up: ## Start all services
	@echo "$(COLOR_BOLD)Starting services...$(COLOR_RESET)"
	$(COMPOSE) up -d
	@echo "$(COLOR_GREEN)✓ Services started$(COLOR_RESET)"
	@$(MAKE) status

up-full: ## Start all services including frontend
	@echo "$(COLOR_BOLD)Starting all services (including frontend)...$(COLOR_RESET)"
	$(COMPOSE) --profile full up -d
	@echo "$(COLOR_GREEN)✓ All services started$(COLOR_RESET)"
	@$(MAKE) status

up-tools: ## Start services with management tools (PgAdmin, Redis Commander)
	@echo "$(COLOR_BOLD)Starting services with management tools...$(COLOR_RESET)"
	$(COMPOSE) --profile tools up -d
	@echo "$(COLOR_GREEN)✓ Services with tools started$(COLOR_RESET)"
	@$(MAKE) status

down: ## Stop all services
	@echo "$(COLOR_BOLD)Stopping services...$(COLOR_RESET)"
	$(COMPOSE) down
	@echo "$(COLOR_GREEN)✓ Services stopped$(COLOR_RESET)"

down-volumes: ## Stop services and remove volumes (WARNING: deletes data!)
	@echo "$(COLOR_YELLOW)⚠ This will delete all data!$(COLOR_RESET)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(COMPOSE) down -v; \
		echo "$(COLOR_GREEN)✓ Services stopped and volumes removed$(COLOR_RESET)"; \
	fi

restart: ## Restart all services
	@echo "$(COLOR_BOLD)Restarting services...$(COLOR_RESET)"
	$(COMPOSE) restart
	@echo "$(COLOR_GREEN)✓ Services restarted$(COLOR_RESET)"

restart-app: ## Restart only backend app
	@echo "$(COLOR_BOLD)Restarting backend app...$(COLOR_RESET)"
	$(COMPOSE) restart app
	@echo "$(COLOR_GREEN)✓ Backend restarted$(COLOR_RESET)"

# =============================================================================
# Database Operations
# =============================================================================

db-migrate: ## Run database migrations
	@echo "$(COLOR_BOLD)Running migrations...$(COLOR_RESET)"
	$(COMPOSE) exec app alembic upgrade head
	@echo "$(COLOR_GREEN)✓ Migrations complete$(COLOR_RESET)"

db-rollback: ## Rollback last migration
	@echo "$(COLOR_BOLD)Rolling back last migration...$(COLOR_RESET)"
	$(COMPOSE) exec app alembic downgrade -1
	@echo "$(COLOR_GREEN)✓ Rollback complete$(COLOR_RESET)"

db-reset: ## Reset database (WARNING: deletes all data!)
	@echo "$(COLOR_YELLOW)⚠ This will delete all database data!$(COLOR_RESET)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(COMPOSE) exec app alembic downgrade base; \
		$(COMPOSE) exec app alembic upgrade head; \
		echo "$(COLOR_GREEN)✓ Database reset complete$(COLOR_RESET)"; \
	fi

db-backup: ## Create database backup
	@echo "$(COLOR_BOLD)Creating database backup...$(COLOR_RESET)"
	@mkdir -p infra/docker/postgres/backup
	$(COMPOSE) exec -T db pg_dump -U postgres project_manager > infra/docker/postgres/backup/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(COLOR_GREEN)✓ Backup created$(COLOR_RESET)"

db-restore: ## Restore database from latest backup
	@echo "$(COLOR_BOLD)Restoring database...$(COLOR_RESET)"
	@LATEST=$$(ls -t infra/docker/postgres/backup/*.sql 2>/dev/null | head -1); \
	if [ -z "$$LATEST" ]; then \
		echo "$(COLOR_YELLOW)No backup files found$(COLOR_RESET)"; \
		exit 1; \
	fi; \
	echo "Restoring from: $$LATEST"; \
	$(COMPOSE) exec -T db psql -U postgres project_manager < "$$LATEST"; \
	echo "$(COLOR_GREEN)✓ Restore complete$(COLOR_RESET)"

db-shell: ## Open database shell
	$(COMPOSE) exec db psql -U postgres project_manager

# =============================================================================
# Testing & Quality
# =============================================================================

test: ## Run tests
	@echo "$(COLOR_BOLD)Running tests...$(COLOR_RESET)"
	$(COMPOSE) exec app pytest -v
	@echo "$(COLOR_GREEN)✓ Tests complete$(COLOR_RESET)"

test-cov: ## Run tests with coverage
	@echo "$(COLOR_BOLD)Running tests with coverage...$(COLOR_RESET)"
	$(COMPOSE) exec app pytest -v --cov=app --cov-report=term-missing --cov-report=html
	@echo "$(COLOR_GREEN)✓ Tests complete. Coverage report: backend/htmlcov/index.html$(COLOR_RESET)"

lint: ## Run linters
	@echo "$(COLOR_BOLD)Running linters...$(COLOR_RESET)"
	$(COMPOSE) exec app ruff check app/
	@echo "$(COLOR_GREEN)✓ Linting complete$(COLOR_RESET)"

format: ## Format code
	@echo "$(COLOR_BOLD)Formatting code...$(COLOR_RESET)"
	$(COMPOSE) exec app black app/
	$(COMPOSE) exec app ruff check --fix app/
	@echo "$(COLOR_GREEN)✓ Formatting complete$(COLOR_RESET)"

type-check: ## Run type checking
	@echo "$(COLOR_BOLD)Running type check...$(COLOR_RESET)"
	$(COMPOSE) exec app mypy app/
	@echo "$(COLOR_GREEN)✓ Type check complete$(COLOR_RESET)"

quality: lint type-check test ## Run all quality checks

# =============================================================================
# Logs & Monitoring
# =============================================================================

logs: ## View logs from all services
	$(COMPOSE) logs -f

logs-app: ## View backend app logs
	$(COMPOSE) logs -f app

logs-db: ## View database logs
	$(COMPOSE) logs -f db

logs-n8n: ## View n8n logs
	$(COMPOSE) logs -f n8n

status: ## Show service status
	@echo "$(COLOR_BOLD)Service Status:$(COLOR_RESET)"
	@$(COMPOSE) ps
	@echo ""
	@echo "$(COLOR_BOLD)Access URLs:$(COLOR_RESET)"
	@echo "$(COLOR_BLUE)Backend API:$(COLOR_RESET)      http://localhost:8000"
	@echo "$(COLOR_BLUE)API Docs:$(COLOR_RESET)         http://localhost:8000/docs"
	@echo "$(COLOR_BLUE)n8n:$(COLOR_RESET)              http://localhost:5678"
	@echo "$(COLOR_BLUE)Frontend:$(COLOR_RESET)         http://localhost:3000"
	@echo "$(COLOR_BLUE)PgAdmin:$(COLOR_RESET)          http://localhost:5050 (if tools profile enabled)"
	@echo "$(COLOR_BLUE)Redis Commander:$(COLOR_RESET)  http://localhost:8081 (if tools profile enabled)"

health: ## Check health of all services
	@echo "$(COLOR_BOLD)Checking service health...$(COLOR_RESET)"
	@$(COMPOSE) ps --format json | jq -r '.[] | "\(.Service): \(.Health)"'

# =============================================================================
# Shell Access
# =============================================================================

shell-app: ## Open shell in backend container
	$(COMPOSE) exec app /bin/bash

shell-db: ## Open shell in database container
	$(COMPOSE) exec db /bin/sh

shell-n8n: ## Open shell in n8n container
	$(COMPOSE) exec n8n /bin/sh

# =============================================================================
# Cleanup
# =============================================================================

clean: ## Clean up Docker resources
	@echo "$(COLOR_BOLD)Cleaning up...$(COLOR_RESET)"
	docker system prune -f
	@echo "$(COLOR_GREEN)✓ Cleanup complete$(COLOR_RESET)"

clean-all: ## Clean up everything (including volumes)
	@echo "$(COLOR_YELLOW)⚠ This will remove all Docker resources!$(COLOR_RESET)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(COMPOSE) down -v; \
		docker system prune -af --volumes; \
		echo "$(COLOR_GREEN)✓ Complete cleanup done$(COLOR_RESET)"; \
	fi

# =============================================================================
# Development Helpers
# =============================================================================

dev: up logs-app ## Start development environment and show logs

seed: ## Seed database with sample data
	@echo "$(COLOR_BOLD)Seeding database...$(COLOR_RESET)"
	$(COMPOSE) exec app python -m app.db.seed
	@echo "$(COLOR_GREEN)✓ Database seeded$(COLOR_RESET)"

generate-migration: ## Generate new migration (usage: make generate-migration MSG="description")
	@if [ -z "$(MSG)" ]; then \
		echo "$(COLOR_YELLOW)Usage: make generate-migration MSG=\"migration description\"$(COLOR_RESET)"; \
		exit 1; \
	fi
	@echo "$(COLOR_BOLD)Generating migration: $(MSG)$(COLOR_RESET)"
	$(COMPOSE) exec app alembic revision --autogenerate -m "$(MSG)"
	@echo "$(COLOR_GREEN)✓ Migration generated$(COLOR_RESET)"

# =============================================================================
# Production Helpers
# =============================================================================

prod-build: ## Build production images
	@echo "$(COLOR_BOLD)Building production images...$(COLOR_RESET)"
	BUILD_TARGET=production $(COMPOSE) build --parallel
	@echo "$(COLOR_GREEN)✓ Production build complete$(COLOR_RESET)"

prod-deploy: prod-build ## Deploy to production
	@echo "$(COLOR_BOLD)Deploying to production...$(COLOR_RESET)"
	BUILD_TARGET=production $(COMPOSE) up -d
	@echo "$(COLOR_GREEN)✓ Production deployment complete$(COLOR_RESET)"

# =============================================================================
# CI/CD
# =============================================================================

ci-test: ## Run tests in CI mode
	@echo "$(COLOR_BOLD)Running CI tests...$(COLOR_RESET)"
	$(COMPOSE) run --rm app pytest -v --cov=app --cov-report=xml

ci-lint: ## Run linters in CI mode
	@echo "$(COLOR_BOLD)Running CI linters...$(COLOR_RESET)"
	$(COMPOSE) run --rm app ruff check app/

ci: ci-lint ci-test ## Run all CI checks

