# 🔐 Login Credentials - ExpenseFlow System

## Database-Based Login Details

All these accounts exist in the **PostgreSQL database** (`seed.sql`).

---

## 👤 Demo User Accounts

### **🔴 Admin Account**
- **Email:** `sarah.admin@techcorp.com`
- **Password:** `password`
- **Role:** Admin
- **Access:** Full system access, manage all users and settings
- **Company:** TechCorp Solutions

### **🟡 CFO Account**
- **Email:** `robert.cfo@techcorp.com`
- **Password:** `password`
- **Role:** CFO (Chief Financial Officer)
- **Access:** Approve expenses, financial oversight, manager-level approvals
- **Company:** TechCorp Solutions

### **🟢 Manager Account**
- **Email:** `mike.manager@techcorp.com`
- **Password:** `password`
- **Role:** Manager
- **Access:** Can approve/reject expenses, view team submissions
- **Reports To:** Robert CFO
- **Company:** TechCorp Solutions

### **🔵 Employee Accounts**

#### Employee 1 - Alice
- **Email:** `alice.employee@techcorp.com`
- **Password:** `password`
- **Role:** Employee
- **Access:** Submit and view own expenses
- **Manager:** Mike Manager
- **Company:** TechCorp Solutions

#### Employee 2 - Bob
- **Email:** `bob.dev@techcorp.com`
- **Password:** `password`
- **Role:** Employee (Developer)
- **Access:** Submit and view own expenses
- **Manager:** Mike Manager
- **Company:** TechCorp Solutions

#### Employee 3 - Emma
- **Email:** `emma.designer@techcorp.com`
- **Password:** `password`
- **Role:** Employee (Designer)
- **Access:** Submit and view own expenses
- **Manager:** Mike Manager
- **Company:** TechCorp Solutions

---

## 📊 Organizational Structure

```
TechCorp Solutions
├── Sarah Admin (Admin)
├── Robert CFO (CFO)
│   └── Mike Manager (Manager)
│       ├── Alice Employee
│       ├── Bob Developer
│       └── Emma Designer
```

---

## 🔑 Password Hash Information

All database users have the same password hash:
```
$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
```

This hash corresponds to the password: **`password`**

---

## 🌐 Backend API Endpoints

### Login
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "sarah.admin@techcorp.com",
  "password": "password"
}
```

### Signup (Create New User)
```bash
POST http://localhost:3001/api/auth/signup
Content-Type: application/json

{
  "email": "newuser@techcorp.com",
  "password": "yourpassword123",
  "firstName": "John",
  "lastName": "Doe",
  "companyId": "11111111-1111-1111-1111-111111111111"
}
```

---

## 🖥️ Frontend Login

### Current Implementation
The frontend currently uses **MOCK authentication** for quick testing:
- Any email/password combination will work
- No backend connection required
- Data stored in localStorage

### To Use Real Backend Authentication
The frontend is configured to work with the backend, but you need to:
1. Start the backend server: `cd backend && npm start`
2. Ensure PostgreSQL database is running
3. Update frontend to remove mock auth (if needed)

---

## 🧪 Testing Login

### Option 1: Frontend (Mock)
1. Go to http://localhost:5175
2. Enter **any email and password**
3. Click Login or Signup
4. You're logged in immediately

### Option 2: Backend (Real Database)
1. Start backend: `cd backend && npm start`
2. Use one of the accounts above
3. Test with cURL:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice.employee@techcorp.com\",\"password\":\"password\"}"
```

---

## 🆔 Default Company ID

All users belong to:
- **Company Name:** TechCorp Solutions
- **Company ID:** `11111111-1111-1111-1111-111111111111`
- **Currency:** USD
- **Country:** US

---

## 🔒 Security Notes

⚠️ **Important:**
- These are **DEMO credentials** for development only
- Password is intentionally simple: `password`
- **DO NOT use these in production!**
- Change all passwords before deploying
- Use strong passwords (min 8 chars, mixed case, numbers, symbols)

---

## 🎯 Recommended Test Accounts

For different testing scenarios:

| Scenario | Use This Account | Email |
|----------|-----------------|-------|
| Employee testing | Alice Employee | alice.employee@techcorp.com |
| Approval testing | Mike Manager | mike.manager@techcorp.com |
| Admin features | Sarah Admin | sarah.admin@techcorp.com |
| Financial ops | Robert CFO | robert.cfo@techcorp.com |

All passwords: **`password`**

---

## 📝 Quick Copy-Paste

### Admin Login
```
Email: sarah.admin@techcorp.com
Password: password
```

### Manager Login
```
Email: mike.manager@techcorp.com
Password: password
```

### Employee Login
```
Email: alice.employee@techcorp.com
Password: password
```

---

**Last Updated:** October 4, 2025
**Database:** PostgreSQL (seed.sql)
**Backend:** Node.js + Express
**Frontend:** React + TypeScript
