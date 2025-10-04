const request = require('supertest');
const app = require('../src/index');
const db = require('../src/models/database');

describe('Expenses API', () => {
  let authToken;
  let testUserId;
  let testExpenseId;

  beforeAll(async () => {
    // Clean up test data - truncate in reverse dependency order
    await db.query('TRUNCATE TABLE audit_logs, approvals, approval_workflows, expense_lines, receipts, expenses, users, companies RESTART IDENTITY CASCADE');
    
    // Insert test company
    await db.query(`
      INSERT INTO companies (id, name, country_code, currency_code, created_at)
      VALUES ('bbbbbbbb-1111-1111-1111-111111111111', 'Test Company Expenses', 'US', 'USD', now())
    `);
    
    // Create a test user and get token
    const userData = {
      email: 'testuser@example.com',
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'User',
      companyId: 'bbbbbbbb-1111-1111-1111-111111111111'
    };

    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send(userData);

    authToken = signupResponse.body.token;
    testUserId = signupResponse.body.user.id;
  });

  afterAll(async () => {
    // Clean up test data
    await db.query('TRUNCATE TABLE audit_logs, approvals, approval_workflows, expense_lines, receipts, expenses, users, companies RESTART IDENTITY CASCADE');
  });

  describe('POST /api/expenses', () => {
    it('should create a new expense', async () => {
      const expenseData = {
        description: 'Test Business Lunch',
        amount: 50.00,
        currencyCode: 'USD',
        category: 'Meals',
        expenseDate: '2025-01-15'
      };

      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData)
        .expect(201);

      expect(response.body.expense).toHaveProperty('id');
      expect(response.body.expense.description).toBe(expenseData.description);
      expect(response.body.expense.amount).toBe('50.00'); // PostgreSQL returns as string
      expect(response.body.expense.status).toBe('draft');

      testExpenseId = response.body.expense.id;
    });

    it('should return error for missing required fields', async () => {
      const invalidExpenseData = {
        description: 'Test Expense'
        // Missing amount and other required fields
      };

      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidExpenseData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/expenses', () => {
    it('should get all expenses for the user', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('expenses');
      expect(Array.isArray(response.body.expenses)).toBe(true);
      expect(response.body.expenses.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/expenses/:id', () => {
    it('should get a specific expense', async () => {
      const response = await request(app)
        .get(`/api/expenses/${testExpenseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.expense.id).toBe(testExpenseId);
      expect(response.body.expense.description).toBe('Test Business Lunch');
    });

    it('should return 404 for non-existent expense', async () => {
      const fakeId = '99999999-9999-9999-9999-999999999999';

      const response = await request(app)
        .get(`/api/expenses/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/expenses/:id', () => {
    it('should update an expense', async () => {
      const updateData = {
        description: 'Updated Test Business Lunch',
        amount: 75.00
      };

      const response = await request(app)
        .put(`/api/expenses/${testExpenseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.expense.description).toBe(updateData.description);
      expect(response.body.expense.amount).toBe('75.00'); // PostgreSQL returns as string
    });
  });

  describe('POST /api/expenses/:id/submit', () => {
    it('should submit expense for approval', async () => {
      const response = await request(app)
        .post(`/api/expenses/${testExpenseId}/submit`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.expense.status).toBe('pending');
    });
  });

  describe('DELETE /api/expenses/:id', () => {
    it('should delete an expense', async () => {
      // Create a new expense to delete (in draft status)
      const expenseData = {
        description: 'Expense to delete',
        amount: 30.00,
        currencyCode: 'USD',
        category: 'Other',
        expenseDate: '2025-01-16'
      };

      const createResponse = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData);

      const expenseIdToDelete = createResponse.body.expense.id;

      const response = await request(app)
        .delete(`/api/expenses/${expenseIdToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });
});