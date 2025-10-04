# 🎯 For Reviewers & Evaluators

Welcome! This guide helps you quickly test and evaluate the **Expense Management System**.

---
# 🎯 For Reviewers & Evaluators

Welcome! This guide helps you quickly test and evaluate the **Expense Management System**.

---

## 🚀 Quick Access

### Live Application URLs
- **Frontend:** http://localhost:5175
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

---

## 🔐 Demo Login Credentials

All passwords are: **`password`**

### 👑 Admin Account - Full System Access

```
Email: sarah.admin@techcorp.com
Password: password
```

**What you can test:**
- User management (add/edit/delete users)
- Approval rules configuration
- System-wide settings
- View all expenses across the company
- Analytics and reporting

---

### 🧑‍💼 Manager Account - Approval Authority

```
Email: mike.manager@techcorp.com
Password: password
```

**What you can test:**
- View pending expense approvals
- Approve or reject expense requests
- Add comments to expense reviews
- View team member submissions
- Track approval history

---

### 🧑‍💻 Employee Account - Standard User

```
Email: alice.employee@techcorp.com
Password: password
```

**What you can test:**
- Submit new expense claims
- Upload receipt images
- Select expense categories
- Multi-currency expense submission
- Track approval status of submissions
- View expense history

---

### 🟡 Additional Test Accounts

**CFO Account** (Financial oversight)

```
Email: robert.cfo@techcorp.com
Password: password
```

**Developer Account**

```
Email: bob.dev@techcorp.com
Password: password
```

**Designer Account**

```
Email: emma.designer@techcorp.com
Password: password
```

---

## 🧪 Suggested Testing Workflow

### 1️⃣ Test as Employee (5 minutes)
1. Login as `alice.employee@techcorp.com`
2. Navigate to Dashboard
3. Click "Add Expense" button
4. Fill in expense details:
   - Description: "Business Lunch"
   - Amount: 50.00
   - Currency: USD
   - Category: Meals
5. Upload a receipt (optional)
6. Submit expense
7. Check expense status

### 2️⃣ Test as Manager (5 minutes)
1. Logout from employee account
2. Login as `mike.manager@techcorp.com`
3. Navigate to "Approvals" tab
4. Review the pending expense from Alice
5. Add a comment
6. Approve or reject the expense
7. Verify the status change

### 3️⃣ Test as Admin (5 minutes)
1. Logout from manager account
2. Login as `sarah.admin@techcorp.com`
3. Navigate to "Admin" panel
4. View all users in the system
5. Check approval rules
6. View system-wide expense statistics

---

## ✨ Key Features to Review

### 🎨 Frontend Features
- ✅ **Dark Mode Support** - Toggle theme using profile dropdown
- ✅ **Responsive Design** - Test on mobile/tablet/desktop
- ✅ **SVG Avatars** - Professional gradient profile icons
- ✅ **Interactive UI** - Smooth transitions and animations
- ✅ **Real-time Updates** - Status changes reflect immediately

### 🔧 Backend Features
- ✅ **RESTful API** - Well-structured endpoints
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-based Access** - Different permissions per role
- ✅ **PostgreSQL Database** - Robust data storage
- ✅ **Password Hashing** - bcrypt for security

### 📊 Business Logic
- ✅ **Approval Workflow** - Draft → Pending → Approved/Rejected
- ✅ **Multi-user Support** - Multiple employees, managers, admins
- ✅ **Company Management** - Multi-company ready
- ✅ **Currency Support** - Multiple currencies with conversion
- ✅ **Receipt Handling** - Upload and attach receipts

---

## 🗂️ Project Structure

```
odoo-hackathon/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main page components
│   │   ├── context/      # Auth and state management
│   │   └── types/        # TypeScript definitions
│   └── public/
│       └── assets/
│           └── avatars/  # SVG profile icons
│
├── backend/              # Node.js + Express
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, validation
│   │   └── models/       # Database models
│   └── tests/            # Unit tests
│
└── database/             # PostgreSQL
    └── db/
        ├── init.sql      # Schema creation
        └── seed.sql      # Demo data
```

---

## 📝 API Endpoints (Backend)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - New user registration

### Expense Management
- `GET /api/expenses` - List user's expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Approvals
- `GET /api/approvals` - Get pending approvals (managers)
- `POST /api/approvals/:id/approve` - Approve expense
- `POST /api/approvals/:id/reject` - Reject expense

### Currency
- `GET /api/currency/rates` - Get exchange rates
- `POST /api/currency/convert` - Convert amounts

---

## 🎨 UI/UX Highlights

### Dark Mode
- Click on your **profile avatar** (top-right)
- Toggle the **theme switch** (sun/moon icon)
- All components adapt to dark theme
- Preference persists across sessions

### Responsive Design
- Desktop: Full sidebar navigation
- Mobile: Hamburger menu with drawer
- Tablet: Optimized layouts
- Touch-friendly buttons and controls

### Accessibility
- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast color schemes

---

## 🔍 Testing Tips

### Browser Console
Open Developer Tools (F12) to see:
- Authentication flow logs
- API request/response data
- State management updates
- Error messages (if any)

### Network Tab
Monitor API calls:
- Request headers (Authorization tokens)
- Response status codes
- Payload data
- Response times

### Testing Different Roles
Each role has different UI elements:
- **Employee:** Dashboard + New Expense
- **Manager:** Dashboard + Approvals
- **Admin:** Dashboard + Approvals + Admin Panel

---

## 📊 Demo Data Overview

### Company
- **Name:** TechCorp Solutions
- **Country:** United States
- **Currency:** USD

### Users
- 1 Admin (Sarah)
- 1 CFO (Robert)
- 1 Manager (Mike)
- 3 Employees (Alice, Bob, Emma)

### Sample Expenses
Pre-seeded expenses exist in the database:
- Business Lunch ($45.50) - Approved
- Taxi to Airport ($25.00) - Pending
- Office Supplies ($120.00) - Approved
- Client Dinner ($89.75) - Rejected

---

## 🐛 Known Issues / Limitations

### Current Limitations
1. **Mock Mode Option:** Frontend can work in mock mode (no backend required) for quick UI testing
2. **OCR Feature:** Currently a placeholder (no actual OCR implementation)
3. **Email Notifications:** Not implemented (no email service configured)
4. **File Upload:** Receipt upload is supported but storage is simplified

### Production Considerations
- Change all default passwords
- Add HTTPS/SSL certificates
- Configure proper CORS settings
- Set up proper file storage (AWS S3, etc.)
- Add rate limiting and security headers
- Implement proper logging and monitoring

---

## 💡 Evaluation Criteria Checklist

### ✅ Functionality
- [x] User authentication working
- [x] Role-based access control
- [x] Expense submission flow
- [x] Approval workflow
- [x] Multi-currency support
- [x] Receipt attachment

### ✅ Code Quality
- [x] TypeScript for type safety
- [x] Clean component architecture
- [x] Reusable components
- [x] Proper error handling
- [x] RESTful API design

### ✅ UI/UX
- [x] Professional design
- [x] Dark mode support
- [x] Responsive layout
- [x] Intuitive navigation
- [x] Visual feedback

### ✅ Documentation
- [x] README with setup instructions
- [x] Demo credentials provided
- [x] Code comments
- [x] API documentation
- [x] Database schema

---

## 📞 Support & Questions

If you encounter any issues or have questions:

1. Check `LOGIN_CREDENTIALS.md` for detailed account information
2. Review `QUICK_START.md` for setup instructions
3. See `DEBUGGING_GUIDE.md` for troubleshooting
4. Open an issue on GitHub

---

## 🏆 Thank You!

Thank you for reviewing the **Expense Management System**. We hope this guide makes your evaluation process smooth and efficient.

**Happy Testing!** 🚀

---

**Last Updated:** October 4, 2025
**Version:** 1.0.0
**Status:** Ready for Review ✅
