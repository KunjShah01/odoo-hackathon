# Database Setup Script for Native PostgreSQL on Windows
# PowerShell version with better error handling

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Expense Management System - Database Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "[ERROR] PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "After installation, add PostgreSQL bin folder to PATH" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[✓] PostgreSQL found: $($psqlPath.Path)" -ForegroundColor Green
Write-Host ""

# Get PostgreSQL password
Write-Host "Enter password for PostgreSQL 'postgres' user:" -ForegroundColor Yellow
$env:PGPASSWORD = Read-Host -AsSecureString | ConvertFrom-SecureString -AsPlainText

Write-Host ""
Write-Host "[1/4] Creating database and user..." -ForegroundColor Cyan
$result = psql -U postgres -f setup_native_postgres.sql 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to create database" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    Write-Host "Make sure PostgreSQL service is running" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[✓] Database and user created successfully" -ForegroundColor Green

# Set password for expense_user
$env:PGPASSWORD = "expense_pass"

Write-Host ""
Write-Host "[2/4] Creating tables and indexes..." -ForegroundColor Cyan
$result = psql -U expense_user -d expense_db -f db\init.sql 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to create tables" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[✓] Tables and indexes created successfully" -ForegroundColor Green

Write-Host ""
Write-Host "[3/4] Loading seed data..." -ForegroundColor Cyan
$result = psql -U expense_user -d expense_db -f db\seed.sql 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to load seed data" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[✓] Seed data loaded successfully" -ForegroundColor Green

Write-Host ""
Write-Host "[4/4] Verifying setup..." -ForegroundColor Cyan
$verification = psql -U expense_user -d expense_db -c "SELECT 'Companies' as table_name, COUNT(*) as count FROM companies UNION ALL SELECT 'Users', COUNT(*) FROM users UNION ALL SELECT 'Expenses', COUNT(*) FROM expenses UNION ALL SELECT 'Receipts', COUNT(*) FROM receipts;" -t
Write-Host $verification -ForegroundColor White

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "[SUCCESS] Database setup complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Connection Details:" -ForegroundColor Cyan
Write-Host "  Host:     localhost" -ForegroundColor White
Write-Host "  Port:     5432" -ForegroundColor White
Write-Host "  Database: expense_db" -ForegroundColor White
Write-Host "  User:     expense_user" -ForegroundColor White
Write-Host "  Password: expense_pass" -ForegroundColor White
Write-Host ""
Write-Host "Connection String:" -ForegroundColor Cyan
Write-Host "  postgresql://expense_user:expense_pass@localhost:5432/expense_db" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open pgAdmin" -ForegroundColor White
Write-Host "  2. Register new server with above connection details" -ForegroundColor White
Write-Host "  3. Start building your backend!" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
