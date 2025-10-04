# 🧾 Expense Management System 🚀

![Status: Active](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange?style=flat-square)
![MIT License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Made with Love](https://img.shields.io/badge/made%20with-%F0%9F%92%96-red?style=flat-square)

---

## 🚀 Quick Start for Reviewers

**Want to test the app immediately?** Here are the demo credentials:

```
👑 Admin:    sarah.admin@techcorp.com / password
🧑‍💼 Manager:  mike.manager@techcorp.com / password  
🧑‍💻 Employee: alice.employee@techcorp.com / password
```

**Access the app:**
- Frontend: http://localhost:5175
- Backend API: http://localhost:3001

**More details:** See [Demo Credentials](#-demo-credentials-for-testing) section below

---

## 📚 Table of Contents

- [Overview](#-overview)
- [System Architecture](#️-system-architecture)
- [Features](#-features)
- [User Roles](#-user-roles)
- [Approval Workflow](#-approval-workflow)
- [Interface Walkthrough](#️-interface-walkthrough)
- [Data Model](#️-data-model-simplified)
- [Getting Started](#️-getting-started)
- [Demo Credentials](#-demo-credentials-for-testing)
- [Contribution](#-contribution)
- [License](#-license)
- [Contact & Support](#-contact--support)

---

## 📖 Overview

The **Expense Management System** is a full-featured platform for automating the submission, approval, and tracking of company expenses. It is designed to provide transparency, efficiency, and robust approval logic for organizations of all sizes.

- 🌍 **Multi-currency**: Supports expense submissions in any currency, with auto-conversion to the company base currency.
- 🔒 **Role-based Access**: Distinct dashboards and permissions for Admins, Managers, and Employees.
- ✅ **Approval Rules**: Flexible approval flows, including percentage-based approvals and manager assignments.
- 🧾 **Receipt Handling**: Upload or scan (OCR) receipts for easy data entry.

---

## 🏗️ System Architecture

- **Frontend**: Interactive web UI for all user roles.
- **Backend**: Handles authentication, business logic, approval flows, and currency conversion.
- **Database**: Stores users, companies, expenses, approval rules, and logs.
- **Integrations**: External API for currency conversion; optional OCR for receipt scanning.

---

## ✨ Features

| Feature                           | Description                                                                                      | Emoji   |
|------------------------------------|--------------------------------------------------------------------------------------------------|---------|
| 👑 Admin Management                | Company creation, user/role assignment, approval rules setup                                     | 👑      |
| 🧑‍💼 Manager Dashboard             | View/approve/reject submitted expenses, leave comments                                           | 🧑‍💼    |
| 🧑‍💻 Employee Dashboard            | Submit expenses, upload receipts, check approval status                                          | 🧑‍💻    |
| 💱 Multi-Currency Support          | Submit in any currency, auto-convert to base currency                                            | 💱      |
| 📸 Receipt Upload & OCR            | Attach or scan receipts for each expense                                                         | 📸      |
| ⏳ Approval Workflow               | Draft ➡️ Waiting Approval ➡️ Approved/Rejected                                                   | ⏳      |
| 🏆 Custom Approval Logic           | Set rules for categories, assign approvers, define approval percentage                           | 🏆      |
| 🔥 Dynamic Assignment              | Approvers and approval rules can be changed any time                                             | 🔥      |
| 🏁 Minimum Approvals               | Specify minimum percentage or number of approvers required                                       | 🏁      |
| 🏷️ Category-Based Rules            | Approval flows can be customized per expense category                                            | 🏷️      |
| 📊 Dashboards & Analytics          | Track expenses, approval rates, pending requests, etc.                                           | 📊      |

---

## 👥 User Roles

### 👑 Admin (Company)

- Registers company and sets the base currency.
- Adds and manages users (Managers, Employees).
- Creates and edits approval rules (categories, approvers, percentages).
- Assigns employees to managers.

### 🧑‍💼 Manager

- Receives expense approval requests.
- Reviews submitted expenses: description, amount, receipt, currency, etc.
- Approves or rejects requests (with optional comments).
- Sees status of each request (pending, approved, rejected).

### 🧑‍💻 Employee

- Submits new expense claims (with receipts, category, amount, currency).
- Uses OCR to auto-fill data from photos.
- Views all past and pending expense requests and their approval statuses.

---

## 🔄 Approval Workflow

1. **Expense Submission**:  
   - Employee fills in details, uploads receipt, selects currency.
   - Expense is saved as **Draft**.

2. **Waiting Approval**:  
   - Upon submission, the request is routed to assigned manager(s).
   - Approval rules (category-specific, percentage required) are enforced.

3. **Approval/Reject**:  
   - Managers can approve or reject. Comments can be added.
   - Once minimum threshold is reached, status updates to **Approved** or **Rejected**.
   - Employee and manager are notified.

4. **Currency Handling**:  
   - Amounts submitted in foreign currency are converted to company’s base currency for reporting.

---

## 🖥️ Interface Walkthrough

Below is a diagram illustrating the user journeys, interfaces, and workflow:

![Expense Management System Flow](./path-to-image/1.png)

### **Signup & Login**

- **Admin Signup**: Name, Email, Password, Company Name, Base Currency.
- **Employee/Manager Login**: Email, Password.
- **Forgot Password**: Password recovery via email.

### **Admin Dashboard**

- **User Management**: Add users, assign roles, link employees to managers.
- **Approval Rules**: Create/edit rules per category, select approvers, set minimum approval percentage.

### **Employee Dashboard**

- **Expense Table**: List of all expenses, current status, upload receipts.
- **New Expense**: Form to enter description, amount, currency, category, receipt.

### **Manager Dashboard**

- **Approvals to Review**: Table of all requests needing action.
- **Approve/Reject**: Buttons for actions, optional feedback field.

---

## 🗃️ Data Model (Simplified)

- **User**:  
  - id, name, email, role, manager_id, company_id, password_hash  
- **Company**:  
  - id, name, base_currency  
- **Expense**:  
  - id, employee_id, category, amount, currency, receipt_url, status, created_at, updated_at  
- **ApprovalRule**:  
  - id, company_id, category, approvers[], min_approval_pct  
- **ApprovalRecord**:  
  - id, expense_id, approver_id, status, comment, timestamp  

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Quick Start

1. **Clone the Repository**
    ```sh
    git clone https://github.com/KunjShah01/odoo-hackathon.git
    cd odoo-hackathon
    ```

2. **Setup Database**
    ```sh
    cd database
    # Follow instructions in database/README.md to setup PostgreSQL
    # Run init.sql and seed.sql to create tables and demo data
    ```

3. **Setup Backend**
    ```sh
    cd backend
    npm install
    # Configure .env file with database credentials
    npm start
    # Backend will run on http://localhost:3001
    ```

4. **Setup Frontend**
    ```sh
    cd frontend
    npm install
    npm run dev -- --port 5175
    # Frontend will run on http://localhost:5175
    ```

5. **Open in Browser**
    - **Frontend:** http://localhost:5175
    - **Backend API:** http://localhost:3001
    - **Health Check:** http://localhost:3001/health

6. **Login with Demo Credentials**
    - See the [Demo Credentials](#-demo-credentials-for-testing) section below
    - Use any of the provided accounts to explore different user roles

---

## 🔐 Demo Credentials for Testing

The application comes with **pre-seeded demo accounts** for immediate testing. All passwords are: **`password`**

### 👑 Admin Account
```
Email: sarah.admin@techcorp.com
Password: password
```
**Access:** Full system administration, user management, approval rules setup

### 🧑‍💼 Manager Account
```
Email: mike.manager@techcorp.com
Password: password
```
**Access:** Approve/reject expenses, view team submissions

### 🧑‍💻 Employee Accounts

**Employee 1 - Alice**
```
Email: alice.employee@techcorp.com
Password: password
```
**Access:** Submit expenses, view approval status

**Employee 2 - Bob (Developer)**
```
Email: bob.dev@techcorp.com
Password: password
```

**Employee 3 - Emma (Designer)**
```
Email: emma.designer@techcorp.com
Password: password
```

### 🟡 CFO Account
```
Email: robert.cfo@techcorp.com
Password: password
```
**Access:** Financial oversight, high-level approvals

### 📊 Demo Company
- **Company Name:** TechCorp Solutions
- **Base Currency:** USD
- **Country:** United States

### 🧪 Testing Scenarios

| Scenario | Use This Account | What You Can Test |
|----------|------------------|-------------------|
| Submit Expenses | alice.employee@techcorp.com | Create new expenses, upload receipts, track status |
| Approve Expenses | mike.manager@techcorp.com | Review pending requests, approve/reject with comments |
| System Admin | sarah.admin@techcorp.com | Manage users, configure approval rules, view analytics |
| Financial Review | robert.cfo@techcorp.com | High-level financial oversight and approvals |

### ⚠️ Security Note
**These are DEMO credentials for development and testing only.**
- Do NOT use these credentials in production
- Change all passwords before deploying to production
- Use strong passwords (min 8 characters with mixed case, numbers, and symbols)

---

## 🤝 Contribution

We welcome contributions!

- Fork the repo & submit a PR
- Open issues for bugs & feature requests
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

---

## 📄 License

MIT License.  
See [LICENSE](LICENSE) for more information.

---

## 💬 Contact & Support

For questions, suggestions, or support, please [open an issue](https://github.com/your-org/expense-management-system/issues) or email us.

---

## 🏷️ Stickers & Emoji Legend

| Emoji      | Meaning                 |
|------------|-------------------------|
| 👑         | Admin                   |
| 🧑‍💼       | Manager                 |
| 🧑‍💻       | Employee                |
| 💱         | Currency                |
| 📸         | Receipt Upload          |
| ⏳         | Approval Pending        |
| 🏆         | Approval Complete       |
| 🧾         | Expense                 |
| 🔥         | Dynamic Assignment      |
| 🏁         | Minimum Approval        |
| 🏷️         | Category Rule           |
| 📊         | Analytics/Dashboard     |
| 🚀         | Fast, Modern            |
| 🛡️         | Security                |

---

> _Happy expense managing!_ 🎉
