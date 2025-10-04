# Expense Management System - Backend API

A Node.js/Express backend API for managing business expenses with approval workflows, OCR receipt processing, and multi-currency support.

## Features

- **User Authentication**: JWT-based authentication with signup and login
- **Expense Management**: Full CRUD operations for expenses
- **Approval Workflows**: Submit expenses for approval and manage approval processes
- **OCR Integration**: Extract text from receipt images using Tesseract
- **Currency Conversion**: Multi-currency support with real-time exchange rates
- **Audit Logging**: Track all expense-related actions
- **PostgreSQL Database**: Robust data storage with proper relationships

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **OCR**: Tesseract.js
- **Validation**: Joi
- **Security**: Helmet, CORS
- **File Upload**: Multer

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v15 or higher)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env` file and update the values:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=expense_db
   DB_USER=expense_user
   DB_PASSWORD=expense_pass
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CURRENCY_API_KEY=your-currency-api-key-here
   CURRENCY_API_URL=https://api.exchangerate-api.com/v4/latest
   UPLOAD_PATH=./uploads
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "companyId": "uuid-of-company"
}
```

#### POST /api/auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Expenses

All expense endpoints require authentication (Bearer token in Authorization header).

#### GET /api/expenses
Get user's expenses with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (draft, pending, approved, rejected)

#### GET /api/expenses/:id
Get a specific expense by ID.

#### POST /api/expenses
Create a new expense.

**Request Body:**
```json
{
  "title": "Business Lunch",
  "description": "Lunch with client",
  "amount": 45.50,
  "currency": "USD",
  "category": "Meals",
  "receiptUrl": "https://example.com/receipt.jpg",
  "expenseDate": "2024-01-15"
}
```

#### PUT /api/expenses/:id
Update an existing expense (only draft expenses can be updated).

#### DELETE /api/expenses/:id
Delete an expense (only draft expenses can be deleted).

#### POST /api/expenses/:id/submit
Submit an expense for approval.

### Approvals

#### GET /api/approvals/pending
Get pending approvals for the current user (manager).

#### POST /api/approvals/:id/approve
Approve an expense.

**Request Body:**
```json
{
  "comments": "Approved for business purposes"
}
```

#### POST /api/approvals/:id/reject
Reject an expense (comments required).

**Request Body:**
```json
{
  "comments": "Missing receipt documentation"
}
```

### OCR

#### POST /api/ocr/extract
Extract text from receipt image.

**Content-Type:** multipart/form-data
**Form Field:** receipt (image file)

### Currency

#### GET /api/currency/rates
Get exchange rates for a base currency.

**Query Parameters:**
- `base` (optional): Base currency code (default: USD)

#### POST /api/currency/convert
Convert currency amount.

**Request Body:**
```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 100
}
```

### Health Check

#### GET /health
Check API health status.

## Database Schema

The API uses PostgreSQL with the following main tables:
- `companies` - Company information
- `users` - User accounts
- `expenses` - Expense records
- `expense_categories` - Expense categories
- `approval_workflows` - Approval process tracking
- `audit_logs` - Action logging

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models/utilities
│   ├── routes/         # API routes
│   └── index.js        # Server entry point
├── uploads/            # File uploads directory
├── .env               # Environment variables
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Helmet for security headers
- CORS configuration
- Input validation with Joi
- File upload restrictions

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use meaningful commit messages

## License
MIT License