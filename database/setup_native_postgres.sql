-- Setup script for native PostgreSQL on Windows
-- Run this as postgres superuser

-- Create user
CREATE USER expense_user WITH PASSWORD 'expense_pass';

-- Create database
CREATE DATABASE expense_db OWNER expense_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE expense_db TO expense_user;

-- Connect to the new database
\c expense_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO expense_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO expense_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO expense_user;

-- Now run the init.sql to create tables
