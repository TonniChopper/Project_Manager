# Multi-stage Dockerfile for FastAPI Backend
# Build args for customization
ARG PYTHON_VERSION=3.12
ARG BUILD_DATE
ARG VCS_REF

# =============================================================================
# Base Stage - Common dependencies
# =============================================================================
FROM python:${PYTHON_VERSION}-slim as base

# Metadata
LABEL maintainer="your-email@example.com" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.title="Project Manager API" \
      org.opencontainers.image.description="FastAPI backend for Project Manager" \
      org.opencontainers.image.source="https://github.com/yourusername/project-manager"

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# =============================================================================
# Dependencies Stage - Install Python packages
# =============================================================================
FROM base as dependencies

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    make \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# =============================================================================
# Development Stage - Hot reload, debugging tools
# =============================================================================
FROM dependencies as development

# Install development dependencies
RUN pip install --no-cache-dir \
    pytest \
    pytest-cov \
    pytest-asyncio \
    black \
    ruff \
    mypy \
    ipython \
    watchfiles

# Copy application code
COPY --chown=appuser:appuser . .

# Create logs directory
RUN mkdir -p /app/logs && chown -R appuser:appuser /app/logs

# Expose port
EXPOSE 8000

# Switch to app user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/health/ || exit 1

# Default command for development (can be overridden by docker-compose)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# =============================================================================
# Builder Stage - Compile and optimize
# =============================================================================
FROM dependencies as builder

# Copy application code
COPY . .

# Remove test and development files
RUN find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true && \
    find . -type f -name "*.pyc" -delete && \
    find . -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true && \
    find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true

# =============================================================================
# Production Stage - Minimal, optimized image
# =============================================================================
FROM base as production

# Copy only necessary files from builder
COPY --from=builder --chown=appuser:appuser /usr/local/lib/python${PYTHON_VERSION}/site-packages /usr/local/lib/python${PYTHON_VERSION}/site-packages
COPY --from=builder --chown=appuser:appuser /usr/local/bin /usr/local/bin
COPY --from=builder --chown=appuser:appuser /app /app

# Create logs directory
RUN mkdir -p /app/logs && chown -R appuser:appuser /app/logs

# Expose port
EXPOSE 8000

# Switch to app user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/health/ || exit 1

# Production command with gunicorn
CMD ["sh", "-c", "alembic upgrade head && gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --log-level info --access-logfile - --error-logfile -"]

# =============================================================================
# Testing Stage - For CI/CD
# =============================================================================
FROM development as testing

# Install additional testing tools
RUN pip install --no-cache-dir \
    pytest-xdist \
    pytest-mock \
    coverage[toml] \
    hypothesis

# Copy test configuration
COPY pytest.ini .
COPY .coveragerc .

# Run tests by default
CMD ["pytest", "-v", "--cov=app", "--cov-report=term-missing", "--cov-report=html"]

