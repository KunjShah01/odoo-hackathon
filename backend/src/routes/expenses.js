const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// All expense routes require authentication
router.use(auth);

// Apply rate limiter to all expense routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
router.use(limiter);

// GET /api/expenses
router.get('/', expenseController.getExpenses);

// GET /api/expenses/:id
router.get('/:id', expenseController.getExpense);

// POST /api/expenses
router.post('/', expenseController.createExpense);

// PUT /api/expenses/:id
router.put('/:id', expenseController.updateExpense);

// DELETE /api/expenses/:id
router.delete('/:id', expenseController.deleteExpense);

// POST /api/expenses/:id/submit
router.post('/:id/submit', expenseController.submitForApproval);

module.exports = router;