const request = require('supertest');
const app = require('../src/index');
const db = require('../src/models/database');

describe('Approvals API', () => {
  let employeeToken;
  let managerToken;
  let employeeId;
  let managerId;
  let testExpenseId;

  beforeAll(async () => {
    // Clean up test data - truncate in reverse dependency order
    await db.query('TRUNCATE TABLE audit_logs, approvals, approval_workflows, expense_lines, receipts, expenses, users, companies RESTART IDENTITY CASCADE');
    
    // Insert test company
    await db.query(`
      INSERT INTO companies (id, name, country_code, currency_code, created_at)
      VALUES ('cccccccc-1111-1111-1111-111111111111', 'Test Company Approvals', 'US', 'USD', now())
    `);
    
    // Create employee user
    const employeeData = {
      email: 'testemployee@example.com',
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'Employee',
      companyId: 'cccccccc-1111-1111-1111-111111111111'
    };

    const employeeSignup = await request(app)
      .post('/api/auth/signup')
      .send(employeeData);

    employeeToken = employeeSignup.body.token;
    employeeId = employeeSignup.body.user.id;

    // Create manager user
    const managerData = {
      email: 'testmanager@example.com',
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'Manager',
      companyId: 'cccccccc-1111-1111-1111-111111111111'
    };

    const managerSignup = await request(app)
      .post('/api/auth/signup')
      .send(managerData);

    managerToken = managerSignup.body.token;
    managerId = managerSignup.body.user.id;

    // Update employee to have manager as their manager
    await db.query('UPDATE users SET manager_id = $1 WHERE id = $2', [managerId, employeeId]);

    // Create a test expense for the employee
    const expenseData = {
      description: 'Test expense for approval',
      category: 'Travel',
      expenseDate: '2025-01-15',
      amount: 500.00,
      currencyCode: 'USD'
    };

    const expenseResponse = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send(expenseData);

    testExpenseId = expenseResponse.body.expense.id;

    // Submit the expense for approval
    await request(app)
      .post(`/api/expenses/${testExpenseId}/submit`)
      .set('Authorization', `Bearer ${employeeToken}`);
  });

  afterAll(async () => {
    // Clean up test data
    await db.query('TRUNCATE TABLE audit_logs, approvals, approval_workflows, expenses, users RESTART IDENTITY CASCADE');
  });

  describe('GET /api/approvals/pending', () => {
    it('should get pending approvals for manager', async () => {
      const response = await request(app)
        .get('/api/approvals/pending')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Should contain the submitted expense
      const expense = response.body.find(e => e.id === testExpenseId);
      expect(expense).toBeDefined();
      expect(expense.status).toBe('pending');
    });

    it('should return empty array for employee', async () => {
      const response = await request(app)
        .get('/api/approvals/pending')
        .set('Authorization', `Bearer ${employeeToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Employee shouldn't see pending approvals
      expect(response.body.length).toBe(0);
    });
  });

  describe('POST /api/approvals/:id/approve', () => {
    it('should approve an expense', async () => {
      // First get the approval ID
      const pendingResponse = await request(app)
        .get('/api/approvals/pending')
        .set('Authorization', `Bearer ${managerToken}`);

      const approval = pendingResponse.body.find(e => e.id === testExpenseId);
      const approvalId = approval.approval_id;

      const approvalData = {
        comments: 'Approved for business purposes'
      };

      const response = await request(app)
        .post(`/api/approvals/${approvalId}/approve`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send(approvalData)
        .expect(200);

      expect(response.body.status).toBe('approved');
      expect(response.body).toHaveProperty('approval');
    });

    it('should return error for non-existent expense', async () => {
      const fakeId = '99999999-9999-9999-9999-999999999999';

      const response = await request(app)
        .post(`/api/approvals/${fakeId}/approve`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ comments: 'Test' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/approvals/:id/reject', () => {
    let rejectExpenseId;

    beforeAll(async () => {
      // Create another expense for rejection test
      const expenseData = {
        description: 'Expense to reject',
        amount: 200.00,
        category: 'Other',
        currencyCode: 'USD',
        expenseDate: '2025-01-16'
      };

      const expenseResponse = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(expenseData);

      rejectExpenseId = expenseResponse.body.expense.id;

      // Submit for approval
      await request(app)
        .post(`/api/expenses/${rejectExpenseId}/submit`)
        .set('Authorization', `Bearer ${employeeToken}`);
    });

    it('should reject an expense', async () => {
      // Get the approval ID
      const pendingResponse = await request(app)
        .get('/api/approvals/pending')
        .set('Authorization', `Bearer ${managerToken}`);

      const approval = pendingResponse.body.find(e => e.id === rejectExpenseId);
      const approvalId = approval.approval_id;

      const rejectionData = {
        comments: 'Not within budget guidelines'
      };

      const response = await request(app)
        .post(`/api/approvals/${approvalId}/reject`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send(rejectionData)
        .expect(200);

      expect(response.body.status).toBe('rejected');
      expect(response.body).toHaveProperty('approval');
    });
  });
});