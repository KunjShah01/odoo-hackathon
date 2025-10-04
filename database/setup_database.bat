@echo off
REM Database Setup Script for Native PostgreSQL on Windows
REM This script sets up the expense_db database with schema and seed data

echo ============================================
echo Expense Management System - Database Setup
echo ============================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    echo After installation, add PostgreSQL bin folder to PATH
    pause
    exit /b 1
)

echo [1/4] Creating database and user...
psql -U postgres -f setup_native_postgres.sql
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create database. Make sure PostgreSQL is running.
    echo You may need to enter the postgres user password.
    pause
    exit /b 1
)

echo.
echo [2/4] Creating tables and indexes...
psql -U expense_user -d expense_db -f db\init.sql
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create tables
    pause
    exit /b 1
)

echo.
echo [3/4] Loading seed data...
psql -U expense_user -d expense_db -f db\seed.sql
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to load seed data
    pause
    exit /b 1
)

echo.
echo [4/4] Verifying setup...
psql -U expense_user -d expense_db -c "SELECT 'Companies: ' || COUNT(*) FROM companies UNION ALL SELECT 'Users: ' || COUNT(*) FROM users UNION ALL SELECT 'Expenses: ' || COUNT(*) FROM expenses;"

echo.
echo ============================================
echo [SUCCESS] Database setup complete!
echo ============================================
echo.
echo Connection Details:
echo   Host:     localhost
echo   Port:     5432
echo   Database: expense_db
echo   User:     expense_user
echo   Password: expense_pass
echo.
echo Connection String:
echo   postgresql://expense_user:expense_pass@localhost:5432/expense_db
echo.
echo Next Steps:
echo   1. Open pgAdmin
echo   2. Register new server with above connection details
echo   3. Start building your backend!
echo.
pause
