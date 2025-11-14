-- =============================================================================
-- Project Manager - PostgreSQL Initialization Script
-- =============================================================================
-- This script runs automatically when the database container starts for the first time
-- =============================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create n8n database if needed
CREATE DATABASE n8n WITH OWNER = postgres ENCODING = 'UTF8';

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Project Manager database initialized successfully';
    RAISE NOTICE 'Timestamp: %', NOW();
END $$;

