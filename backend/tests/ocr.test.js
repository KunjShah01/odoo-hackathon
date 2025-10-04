const request = require('supertest');
const app = require('../src/index');
const db = require('../src/models/database');

describe('OCR API', () => {
  let authToken;

  beforeAll(async () => {
    // Clean up test data - truncate in reverse dependency order
    await db.query('TRUNCATE TABLE audit_logs, approvals, approval_workflows, expense_lines, receipts, expenses, users, companies RESTART IDENTITY CASCADE');
    
    // Insert test company
    await db.query(`
      INSERT INTO companies (id, name, country_code, currency_code, created_at)
      VALUES ('dddddddd-1111-1111-1111-111111111111', 'Test Company OCR', 'US', 'USD', now())
    `);
    
    // Create a test user and get token
    const userData = {
      email: 'testuser@example.com',
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'User',
      companyId: 'dddddddd-1111-1111-1111-111111111111'
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

  describe('POST /api/ocr/extract', () => {
    it('should return error for missing file', async () => {
      const response = await request(app)
        .post('/api/ocr/extract')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return error for invalid file type', async () => {
      const response = await request(app)
        .post('/api/ocr/extract')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('receipt', Buffer.from('not an image'), 'test.txt')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return error for unauthenticated request', async () => {
      const response = await request(app)
        .post('/api/ocr/extract')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    // Note: Actual OCR extraction test would require a valid image file
    // and would be tested in integration tests with mocked Tesseract
  });
});