# =============================================================================
# Project Manager - PowerShell Management Scripts
# =============================================================================
# Usage: .\scripts\manage.ps1 <command>
# Example: .\scripts\manage.ps1 help
# =============================================================================

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

$ErrorActionPreference = "Stop"
$ComposeFile = "infra\docker\docker-compose.yml"

# Colors
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success { Write-ColorOutput Green "✓ $args" }
function Write-Error { Write-ColorOutput Red "✗ $args" }
function Write-Warning { Write-ColorOutput Yellow "⚠ $args" }
function Write-Info { Write-ColorOutput Cyan "ℹ $args" }

# =============================================================================
# Commands
# =============================================================================

function Show-Help {
    Write-ColorOutput Cyan @"
╔════════════════════════════════════════════════════════════════╗
║         Project Manager - Management Commands                   ║
╚════════════════════════════════════════════════════════════════╝

SETUP & INSTALLATION:
  setup              Initial project setup
  install            Install all dependencies

DOCKER OPERATIONS:
  build              Build all Docker images
  up                 Start all services
  up-full            Start all services including frontend
  up-tools           Start with management tools (PgAdmin, Redis Commander)
  down               Stop all services
  restart            Restart all services
  restart-app        Restart only backend app

DATABASE:
  db-migrate         Run database migrations
  db-rollback        Rollback last migration
  db-backup          Create database backup
  db-restore         Restore from latest backup
  db-shell           Open database shell

TESTING & QUALITY:
  test               Run tests
  test-cov           Run tests with coverage
  lint               Run linters
  format             Format code
  quality            Run all quality checks

LOGS & MONITORING:
  logs               View all logs
  logs-app           View backend logs
  status             Show service status
  health             Check service health

SHELL ACCESS:
  shell-app          Open shell in backend container
  shell-db           Open shell in database container

CLEANUP:
  clean              Clean up Docker resources
  stop-all           Stop all containers

EXAMPLES:
  .\scripts\manage.ps1 up
  .\scripts\manage.ps1 db-migrate
  .\scripts\manage.ps1 test

"@
}

function Setup {
    Write-Info "Setting up project..."

    if (-not (Test-Path "infra\docker\.env")) {
        Write-Info "Creating .env file from template..."
        Copy-Item "infra\docker\.env.example" "infra\docker\.env"
        Write-Success ".env created. Please review and update values."
    } else {
        Write-Warning ".env already exists"
    }

    Write-Success "Setup complete!"
}

function Install {
    Setup
    Write-Info "Installing dependencies..."
    Set-Location backend
    pip install -r requirements.txt
    Set-Location ..
    Write-Success "Dependencies installed"
}

function Build {
    Write-Info "Building Docker images..."
    docker-compose -f $ComposeFile build --parallel
    Write-Success "Build complete"
}

function Start {
    Write-Info "Starting services..."
    docker-compose -f $ComposeFile up -d
    Write-Success "Services started"
    Show-Status
}

function Start-Full {
    Write-Info "Starting all services (including frontend)..."
    docker-compose -f $ComposeFile --profile full up -d
    Write-Success "All services started"
    Show-Status
}

function Start-Tools {
    Write-Info "Starting services with management tools..."
    docker-compose -f $ComposeFile --profile tools up -d
    Write-Success "Services with tools started"
    Show-Status
}

function Stop {
    Write-Info "Stopping services..."
    docker-compose -f $ComposeFile down
    Write-Success "Services stopped"
}

function Restart {
    Write-Info "Restarting services..."
    docker-compose -f $ComposeFile restart
    Write-Success "Services restarted"
}

function Restart-App {
    Write-Info "Restarting backend app..."
    docker-compose -f $ComposeFile restart app
    Write-Success "Backend restarted"
}

function DB-Migrate {
    Write-Info "Running migrations..."
    docker-compose -f $ComposeFile exec app alembic upgrade head
    Write-Success "Migrations complete"
}

function DB-Rollback {
    Write-Info "Rolling back last migration..."
    docker-compose -f $ComposeFile exec app alembic downgrade -1
    Write-Success "Rollback complete"
}

function DB-Backup {
    Write-Info "Creating database backup..."
    $backupDir = "infra\docker\postgres\backup"
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "$backupDir\backup_$timestamp.sql"
    docker-compose -f $ComposeFile exec -T db pg_dump -U postgres project_manager > $backupFile
    Write-Success "Backup created: $backupFile"
}

function DB-Restore {
    Write-Info "Restoring database..."
    $backups = Get-ChildItem "infra\docker\postgres\backup\*.sql" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
    if ($backups.Count -eq 0) {
        Write-Error "No backup files found"
        return
    }
    $latest = $backups[0]
    Write-Info "Restoring from: $($latest.Name)"
    Get-Content $latest.FullName | docker-compose -f $ComposeFile exec -T db psql -U postgres project_manager
    Write-Success "Restore complete"
}

function DB-Shell {
    docker-compose -f $ComposeFile exec db psql -U postgres project_manager
}

function Test {
    Write-Info "Running tests..."
    docker-compose -f $ComposeFile exec app pytest -v
    Write-Success "Tests complete"
}

function Test-Coverage {
    Write-Info "Running tests with coverage..."
    docker-compose -f $ComposeFile exec app pytest -v --cov=app --cov-report=term-missing --cov-report=html
    Write-Success "Tests complete. Coverage report: backend/htmlcov/index.html"
}

function Lint {
    Write-Info "Running linters..."
    docker-compose -f $ComposeFile exec app ruff check app/
    Write-Success "Linting complete"
}

function Format {
    Write-Info "Formatting code..."
    docker-compose -f $ComposeFile exec app black app/
    docker-compose -f $ComposeFile exec app ruff check --fix app/
    Write-Success "Formatting complete"
}

function Quality {
    Lint
    Test
}

function Show-Logs {
    docker-compose -f $ComposeFile logs -f
}

function Show-Logs-App {
    docker-compose -f $ComposeFile logs -f app
}

function Show-Status {
    Write-Info "Service Status:"
    docker-compose -f $ComposeFile ps
    Write-Host ""
    Write-ColorOutput Cyan "Access URLs:"
    Write-Host "Backend API:      http://localhost:8000"
    Write-Host "API Docs:         http://localhost:8000/docs"
    Write-Host "n8n:              http://localhost:5678"
    Write-Host "Frontend:         http://localhost:3000"
    Write-Host "PgAdmin:          http://localhost:5050 (if tools enabled)"
    Write-Host "Redis Commander:  http://localhost:8081 (if tools enabled)"
}

function Show-Health {
    Write-Info "Checking service health..."
    docker-compose -f $ComposeFile ps --format json | ConvertFrom-Json | ForEach-Object {
        Write-Host "$($_.Service): $($_.Health)"
    }
}

function Shell-App {
    docker-compose -f $ComposeFile exec app /bin/bash
}

function Shell-DB {
    docker-compose -f $ComposeFile exec db /bin/sh
}

function Clean {
    Write-Info "Cleaning up..."
    docker system prune -f
    Write-Success "Cleanup complete"
}

function Stop-All {
    Write-Info "Stopping all containers..."
    docker stop $(docker ps -q)
    Write-Success "All containers stopped"
}

# =============================================================================
# Command Router
# =============================================================================

switch ($Command.ToLower()) {
    "help" { Show-Help }
    "setup" { Setup }
    "install" { Install }
    "build" { Build }
    "up" { Start }
    "up-full" { Start-Full }
    "up-tools" { Start-Tools }
    "down" { Stop }
    "restart" { Restart }
    "restart-app" { Restart-App }
    "db-migrate" { DB-Migrate }
    "db-rollback" { DB-Rollback }
    "db-backup" { DB-Backup }
    "db-restore" { DB-Restore }
    "db-shell" { DB-Shell }
    "test" { Test }
    "test-cov" { Test-Coverage }
    "lint" { Lint }
    "format" { Format }
    "quality" { Quality }
    "logs" { Show-Logs }
    "logs-app" { Show-Logs-App }
    "status" { Show-Status }
    "health" { Show-Health }
    "shell-app" { Shell-App }
    "shell-db" { Shell-DB }
    "clean" { Clean }
    "stop-all" { Stop-All }
    default {
        Write-Error "Unknown command: $Command"
        Write-Info "Run '.\scripts\manage.ps1 help' for available commands"
        exit 1
    }
}

