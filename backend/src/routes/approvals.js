const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const auth = require('../middleware/auth');

// Add rate limiting middleware
const rateLimit = require('express-rate-limit');
const approvalsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // Disable the deprecated X-RateLimit-* headers
});

// All approval routes require authentication
router.use(auth);
router.use(approvalsLimiter);

// GET /api/approvals/pending
router.get('/pending', approvalController.getPendingApprovals);

// POST /api/approvals/:id/approve
router.post('/:id/approve', approvalController.approveExpense);

// POST /api/approvals/:id/reject
router.post('/:id/reject', approvalController.rejectExpense);

module.exports = router;