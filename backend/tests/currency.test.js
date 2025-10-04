const request = require('supertest');
const app = require('../src/index');
const db = require('../src/models/database');

describe('Currency API', () => {
  let authToken;

  beforeAll(async () => {
    // Clean up test data - truncate in reverse dependency order
    await db.query('TRUNCATE TABLE audit_logs, approvals, approval_workflows, expense_lines, receipts, expenses, users, companies RESTART IDENTITY CASCADE');
    
    // Insert test company
    await db.query(`
      INSERT INTO companies (id, name, country_code, currency_code, created_at)
      VALUES ('eeeeeeee-1111-1111-1111-111111111111', 'Test Company Currency', 'US', 'USD', now())
    `);
    
    // Create a test user and get token
    const userData = {
      email: 'testuser@example.com',
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'User',
      companyId: 'eeeeeeee-1111-1111-1111-111111111111'
    };

    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send(userData);

    authToken = signupResponse.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await db.query('TRUNCATE TABLE audit_logs, approvals, approval_workflows, expense_lines, receipts, expenses, users, companies RESTART IDENTITY CASCADE');
  });

  describe('GET /api/currency/rates', () => {
    it('should get exchange rates', async () => {
      const response = await request(app)
        .get('/api/currency/rates')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('rates');
      expect(typeof response.body.rates).toBe('object');
      // Should have some common currency rates
      expect(response.body.rates).toHaveProperty('USD');
      expect(response.body.rates).toHaveProperty('EUR');
    });

    it('should return error for unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/currency/rates')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/currency/convert', () => {
    it('should convert currency', async () => {
      const conversionData = {
        from: 'USD',
        to: 'EUR',
        amount: 100
      };

      const response = await request(app)
        .post('/api/currency/convert')
        .set('Authorization', `Bearer ${authToken}`)
        .send(conversionData)
        .expect(200);

      expect(response.body).toHaveProperty('convertedAmount');
      expect(response.body).toHaveProperty('from');
      expect(response.body).toHaveProperty('to');
      expect(response.body).toHaveProperty('originalAmount');
      expect(response.body.from).toBe('USD');
      expect(response.body.to).toBe('EUR');
      expect(response.body.originalAmount).toBe(100);
      expect(typeof response.body.convertedAmount).toBe('number');
    });

    it('should return error for invalid currency codes', async () => {
      const invalidConversionData = {
        from: 'INVALID',
        to: 'EUR',
        amount: 100
      };

      const response = await request(app)
        .post('/api/currency/convert')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidConversionData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return error for missing required fields', async () => {
      const incompleteData = {
        from: 'USD',
        to: 'EUR'
        // Missing amount
      };

      const response = await request(app)
        .post('/api/currency/convert')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return error for unauthenticated request', async () => {
      const conversionData = {
        from: 'USD',
        to: 'EUR',
        amount: 100
      };

      const response = await request(app)
        .post('/api/currency/convert')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});