# Expense Management System - Database Documentation

## 📋 Overview
PostgreSQL database schema for the Expense Management System supporting multi-level approval workflows, OCR receipt parsing, and currency conversion.

**🎯 This guide uses native PostgreSQL installation on Windows (not Docker).**

## 🏗 Architecture

### Database Structure
```
expense_db (PostgreSQL 15)
├── companies          # Multi-tenant company data
├── users              # Employees, managers, admins, CFO
├── expenses           # Expense records with status tracking
├── expense_lines      # Detailed line items per expense
├── receipts           # Receipt files with OCR data
├── approval_flows     # Company-defined approval sequences
├── approval_steps     # Steps in each approval flow
├── approval_rules     # Conditional rules (%, specific, hybrid)
├── approvals          # Approval actions taken
├── audit_logs         # Complete audit trail
└── currency_rates     # Currency conversion cache
```

## 🚀 Quick Start (Native PostgreSQL on Windows)

### Prerequisites

1. **PostgreSQL 15+** installed on Windows
   - Download: https://www.postgresql.org/download/windows/
   - During installation, remember the `postgres` user password
   - Make sure PostgreSQL service is running

2. **pgAdmin** (usually included with PostgreSQL installation)

3. **Add PostgreSQL to PATH** (if not done during installation)
   ```
   C:\Program Files\PostgreSQL\15\bin
   ```

### Automatic Setup (Recommended)

**Option 1: Using PowerShell (Recommended)**

1. Open PowerShell in the `database/` directory
2. Run:
   ```powershell
   .\setup_database.ps1
   ```
3. Enter your postgres password when prompted
4. Script will create database, tables, and load seed data automatically

**Option 2: Using Command Prompt**

1. Open CMD in the `database/` directory
2. Run:
   ```cmd
   setup_database.bat
   ```
3. Enter postgres password when prompted

### Manual Setup

If you prefer manual steps:

#### 1. Create Database and User

```cmd
psql -U postgres -f setup_native_postgres.sql
```

Enter postgres password when prompted.

#### 2. Create Tables and Indexes

```cmd
psql -U expense_user -d expense_db -f db\init.sql
```

Password: `expense_pass`

#### 3. Load Seed Data

```cmd
psql -U expense_user -d expense_db -f db\seed.sql
```

#### 4. Verify Setup

```cmd
psql -U expense_user -d expense_db -c "SELECT 'Companies: ' || COUNT(*) FROM companies UNION ALL SELECT 'Users: ' || COUNT(*) FROM users UNION ALL SELECT 'Expenses: ' || COUNT(*) FROM expenses;"
```

Expected output:
```
 Companies: 1
 Users: 6
 Expenses: 5
```

### Connect pgAdmin to Database

1. Open pgAdmin
2. Right-click "Servers" → "Register" → "Server"
3. **General tab:**
   - Name: `Expense DB - Local`
4. **Connection tab:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `expense_db`
   - Username: `expense_user`
   - Password: `expense_pass`
5. Click "Save"

✅ You should now see all tables under Schemas → public → Tables

### 5. Verify Setup

```sql
-- Run in pgAdmin Query Tool
SELECT 'Companies' as table_name, COUNT(*) as count FROM companies
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Expenses', COUNT(*) FROM expenses
UNION ALL
SELECT 'Receipts', COUNT(*) FROM receipts;
```

Expected output:
```
table_name  | count
------------|------
Companies   |   1
Users       |   6
Expenses    |   5
Receipts    |   4
```

## 📊 Database Schema Details

### Core Tables

#### `companies`
Multi-tenant company data with currency settings.
```sql
id              UUID PRIMARY KEY
name            VARCHAR(255)
country_code    VARCHAR(10)
currency_code   VARCHAR(10)    -- Default currency (USD, EUR, etc.)
created_at      TIMESTAMPTZ
```

#### `users`
All system users with role-based access.
```sql
id                  UUID PRIMARY KEY
company_id          UUID → companies
full_name           VARCHAR(255)
email               VARCHAR(255) UNIQUE
role                VARCHAR(50)         -- 'employee','manager','admin','cfo'
is_manager_approver BOOLEAN             -- Can this user approve expenses?
manager_id          UUID → users        -- Reporting hierarchy
created_at          TIMESTAMPTZ
```

#### `expenses`
Expense submission records.
```sql
id                 UUID PRIMARY KEY
company_id         UUID → companies
submitter_id       UUID → users
description        TEXT
category           VARCHAR(100)        -- 'Meals','Travel','Software', etc.
expense_date       DATE                -- When expense occurred
amount             NUMERIC(14,2)       -- Original amount
currency_code      VARCHAR(10)         -- Original currency
normalized_amount  NUMERIC(14,2)       -- Converted to company currency
status             VARCHAR(20)         -- 'draft','pending','approved','rejected'
submitted_at       TIMESTAMPTZ
updated_at         TIMESTAMPTZ
```

#### `receipts`
Receipt files with OCR-parsed data.
```sql
id          UUID PRIMARY KEY
expense_id  UUID → expenses
file_url    TEXT                    -- File storage path/URL
ocr_json    JSONB                   -- Parsed OCR data
uploaded_at TIMESTAMPTZ

-- Example OCR JSON:
{
  "amount": 120.50,
  "date": "2025-10-01",
  "merchant": "La Bella Italia",
  "category": "Meals"
}
```

#### `approval_flows`
Company-defined approval workflows.
```sql
id          UUID PRIMARY KEY
company_id  UUID → companies
name        VARCHAR(255)         -- e.g., "Standard Flow", "High-Value Flow"
created_at  TIMESTAMPTZ
```

#### `approval_steps`
Sequential steps in an approval flow.
```sql
id                UUID PRIMARY KEY
flow_id           UUID → approval_flows
step_order        INT                  -- 1, 2, 3 (sequence)
approver_role     VARCHAR(50)          -- 'manager','cfo','admin'
approver_user_id  UUID → users         -- Optional: specific user
created_at        TIMESTAMPTZ
```

#### `approval_rules`
Conditional approval rules.
```sql
id                    UUID PRIMARY KEY
flow_id               UUID → approval_flows
rule_type             VARCHAR(20)          -- 'percentage','specific','hybrid'
percentage_required   INT                  -- e.g., 60 (for 60% approval)
specific_approver_id  UUID → users         -- Required approver
```

#### `approvals`
Individual approval actions.
```sql
id          UUID PRIMARY KEY
expense_id  UUID → expenses
step_id     UUID → approval_steps
approver_id UUID → users
status      VARCHAR(20)            -- 'pending','approved','rejected'
comment     TEXT
acted_at    TIMESTAMPTZ
```

#### `audit_logs`
Complete audit trail for compliance.
```sql
id          BIGSERIAL PRIMARY KEY
expense_id  UUID → expenses
user_id     UUID → users
event_type  VARCHAR(100)          -- 'expense_created','approval_granted', etc.
payload     JSONB                 -- Event details
created_at  TIMESTAMPTZ
```

#### `currency_rates`
Cached exchange rates.
```sql
base_currency    VARCHAR(10)
target_currency  VARCHAR(10)
rate             NUMERIC(18,8)
fetched_at       TIMESTAMPTZ
PRIMARY KEY (base_currency, target_currency)
```

## 🔍 Indexes

Performance indexes are created on:
- User lookups: `email`, `company_id`, `role`
- Expense queries: `company_id + status`, `submitter_id`, `expense_date`
- Approval queries: `expense_id`, `approver_id + status`
- Audit queries: `created_at`, `event_type`

## 🧪 Demo Data

The seed data creates:

### Demo Company
- **Name:** TechCorp Solutions
- **Currency:** USD
- **Country:** US

### Demo Users
| Name | Email | Role | Manager |
|------|-------|------|---------|
| Sarah Admin | sarah.admin@techcorp.com | admin | - |
| Robert CFO | robert.cfo@techcorp.com | cfo | - |
| Mike Manager | mike.manager@techcorp.com | manager | Robert CFO |
| Alice Employee | alice.employee@techcorp.com | employee | Mike Manager |
| Bob Developer | bob.dev@techcorp.com | employee | Mike Manager |
| Emma Designer | emma.designer@techcorp.com | employee | Mike Manager |

### Demo Expenses
| Submitter | Amount | Category | Status | Description |
|-----------|--------|----------|--------|-------------|
| Alice | $120.50 | Meals | draft | Team lunch |
| Bob | $450.00 | Travel | pending | Conference registration |
| Emma | $85.00 | Software | pending | Design subscription |
| Alice | $200.00 | Meals | approved | Client dinner (prev month) |
| Bob | $35.00 | Meals | rejected | Personal expense |

### Approval Flows
1. **Standard Flow:** Manager → CFO (60% approval rule)
2. **High-Value Flow:** Manager → CFO → Admin (specific approver rule)

## 🔗 Connection Details

### For Backend Development
```env
DATABASE_URL=postgresql://expense_user:expense_pass@localhost:5432/expense_db
```

### Direct psql Access (Windows)
```cmd
psql -U expense_user -d expense_db
```
Password: `expense_pass`

### Connection Parameters
```
Host:     localhost (or 127.0.0.1)
Port:     5432
Database: expense_db
User:     expense_user
Password: expense_pass
```

## 📝 Common Queries

### Get pending approvals for a manager
```sql
SELECT 
    e.id, 
    e.description, 
    e.amount, 
    u.full_name as submitter,
    e.status
FROM expenses e
JOIN users u ON e.submitter_id = u.id
JOIN approvals a ON e.id = a.expense_id
WHERE a.approver_id = '44444444-4444-4444-4444-444444444444'  -- Mike Manager
  AND a.status = 'pending';
```

### Get expense history for an employee
```sql
SELECT 
    e.expense_date,
    e.description,
    e.amount,
    e.currency_code,
    e.status,
    e.submitted_at
FROM expenses e
WHERE e.submitter_id = '55555555-5555-5555-5555-555555555555'  -- Alice
ORDER BY e.expense_date DESC;
```

### Get audit trail for an expense
```sql
SELECT 
    al.created_at,
    al.event_type,
    u.full_name as actor,
    al.payload
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.expense_id = 'e2222222-2222-2222-2222-222222222222'
ORDER BY al.created_at ASC;
```

### Calculate total pending expenses by category
```sql
SELECT 
    category,
    COUNT(*) as count,
    SUM(normalized_amount) as total_usd
FROM expenses
WHERE status = 'pending'
  AND company_id = '11111111-1111-1111-1111-111111111111'
GROUP BY category
ORDER BY total_usd DESC;
```

## 🛠 Maintenance

### Reset Database (⚠️ Destroys all data)

**PowerShell:**
```powershell
psql -U postgres -c "DROP DATABASE IF EXISTS expense_db;"
psql -U postgres -c "DROP USER IF EXISTS expense_user;"
.\setup_database.ps1
```

**CMD:**
```cmd
psql -U postgres -c "DROP DATABASE IF EXISTS expense_db;"
psql -U postgres -c "DROP USER IF EXISTS expense_user;"
setup_database.bat
```

### Backup Database

```cmd
pg_dump -U expense_user expense_db > backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql
```

Or with timestamp:
```cmd
pg_dump -U expense_user -d expense_db -f backup_expense_db.sql
```

### Restore from Backup

```cmd
psql -U expense_user -d expense_db -f backup_expense_db.sql
```

### Check PostgreSQL Service Status

```cmd
sc query postgresql-x64-15
```

Or in PowerShell:
```powershell
Get-Service -Name postgresql-x64-15
```

### Restart PostgreSQL Service

```cmd
net stop postgresql-x64-15
net start postgresql-x64-15
```

## 🎯 Next Steps for Backend Developer

1. **Install DB driver** in your backend:
   - Python: `pip install psycopg2-binary`
   - Node: `npm install pg`

2. **Test connection:**
```python
# Python example
import psycopg2
conn = psycopg2.connect(
    host="localhost",
    database="expense_db",
    user="expense_user",
    password="expense_pass"
)
print("✅ Connected to database!")
```

3. **Start building APIs:**
   - `POST /auth/signup` - User registration
   - `POST /expenses` - Create expense
   - `GET /expenses/pending` - Get pending approvals
   - `POST /approvals` - Approve/reject expense

## 🔐 Security Notes

- ⚠️ Default passwords are for **development only**
- For production: Use environment variables
- Enable SSL/TLS for PostgreSQL connections
- Implement row-level security (RLS) for multi-tenancy
- Rotate credentials regularly

## 📞 Troubleshooting

### PostgreSQL not in PATH
Add PostgreSQL bin directory to PATH:
1. Search "Environment Variables" in Windows
2. Edit "Path" variable
3. Add: `C:\Program Files\PostgreSQL\15\bin`
4. Restart your terminal

### Can't connect to PostgreSQL
Check if service is running:
```cmd
sc query postgresql-x64-15
```

Start the service:
```cmd
net start postgresql-x64-15
```

### Tables aren't being created
Verify connection and check tables:
```cmd
psql -U expense_user -d expense_db -c "\dt"
```

If empty, rerun init.sql:
```cmd
psql -U expense_user -d expense_db -f db\init.sql
```

### pgAdmin won't connect
- Use hostname `localhost` (not `postgres` - that's for Docker)
- Verify PostgreSQL is running: `sc query postgresql-x64-15`
- Check firewall isn't blocking port 5432
- Make sure you're using correct credentials:
  - User: `expense_user`
  - Password: `expense_pass`
  - Database: `expense_db`

### "psql: command not found"
PostgreSQL bin folder is not in PATH. See "PostgreSQL not in PATH" above.

---
**Database Version:** PostgreSQL 15  
**Last Updated:** October 4, 2025  
**Schema Version:** 1.0
