# 🚀 Quick Reference - Database Setup

## ⚡ Fast Setup (Copy-Paste Commands)

### Step 1: Run Setup Script
```powershell
# PowerShell (Recommended)
cd database
.\setup_database.ps1
```

OR

```cmd
REM Command Prompt
cd database
setup_database.bat
```

### Step 2: Test Connection
```cmd
psql -U expense_user -d expense_db -c "\dt"
```

## 📋 Connection Details

```
Host:     localhost
Port:     5432
Database: expense_db
User:     expense_user
Password: expense_pass
```

**Connection String:**
```
postgresql://expense_user:expense_pass@localhost:5432/expense_db
```

## 🔧 Useful Commands

### Connect to Database
```cmd
psql -U expense_user -d expense_db
```

### List All Tables
```sql
\dt
```

### Describe a Table
```sql
\d expenses
```

### See Table Data
```sql
SELECT * FROM companies;
SELECT * FROM users;
SELECT * FROM expenses;
```

### Exit psql
```sql
\q
```

## 🧪 Demo Data Summary

**Company:** TechCorp Solutions (USD)

**Users:**
- sarah.admin@techcorp.com (Admin)
- robert.cfo@techcorp.com (CFO)
- mike.manager@techcorp.com (Manager)
- alice.employee@techcorp.com (Employee)
- bob.dev@techcorp.com (Employee)
- emma.designer@techcorp.com (Employee)

**Password for all demo users:** expense_pass

**Expenses:**
- 1 Draft expense (Alice - $120.50)
- 2 Pending expenses (Bob - $450, Emma - $85)
- 1 Approved expense (Alice - $200)
- 1 Rejected expense (Bob - $35)

## 🔄 Reset Database
```cmd
psql -U postgres -c "DROP DATABASE IF EXISTS expense_db;"
psql -U postgres -c "DROP USER IF EXISTS expense_user;"
cd database
setup_database.bat
```

## 📊 Verify Setup Query
```sql
SELECT 'Companies' as table_name, COUNT(*) as count FROM companies
UNION ALL SELECT 'Users', COUNT(*) FROM users
UNION ALL SELECT 'Expenses', COUNT(*) FROM expenses
UNION ALL SELECT 'Receipts', COUNT(*) FROM receipts
UNION ALL SELECT 'Approval Flows', COUNT(*) FROM approval_flows
UNION ALL SELECT 'Approval Steps', COUNT(*) FROM approval_steps;
```

**Expected Output:**
```
 table_name      | count
-----------------|-------
 Companies       |     1
 Users           |     6
 Expenses        |     5
 Receipts        |     4
 Approval Flows  |     2
 Approval Steps  |     5
```

## 🐛 Quick Troubleshooting

**Problem:** `psql: command not found`  
**Solution:** Add to PATH: `C:\Program Files\PostgreSQL\15\bin`

**Problem:** Can't connect  
**Solution:** Check service is running
```cmd
sc query postgresql-x64-15
net start postgresql-x64-15
```

**Problem:** Tables not created  
**Solution:** Rerun init.sql
```cmd
psql -U expense_user -d expense_db -f db\init.sql
```

## 📞 Need Help?
See full documentation: `database/README.md`
