const request = require('supertest');
const app = require('../src/index');
const db = require('../src/models/database');

describe('Auth API', () => {
  beforeAll(async () => {
    // Clean up test data - truncate in reverse dependency order
    await db.query('TRUNCATE TABLE audit_logs, approvals, approval_workflows, expense_lines, receipts, expenses, users, companies RESTART IDENTITY CASCADE');
    
    // Insert test company
    await db.query(`
      INSERT INTO companies (id, name, country_code, currency_code, created_at)
      VALUES ('aaaaaaaa-1111-1111-1111-111111111111', 'Test Company Auth', 'US', 'USD', now())
    `);
  });

  afterAll(async () => {
    // Clean up test data
    await db.query('TRUNCATE TABLE audit_logs, approvals, approval_workflows, expense_lines, receipts, expenses, users, companies RESTART IDENTITY CASCADE');
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'testuser@example.com',
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User',
        companyId: 'aaaaaaaa-1111-1111-1111-111111111111' // Use test company ID
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        email: 'testuser@example.com',
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User',
        companyId: '11111111-1111-1111-1111-111111111111'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'testpass123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});