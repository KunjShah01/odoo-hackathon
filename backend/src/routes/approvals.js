const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const auth = require('../middleware/auth');

// All approval routes require authentication
router.use(auth);

// GET /api/approvals/pending
router.get('/pending', approvalController.getPendingApprovals);

// POST /api/approvals/:id/approve
router.post('/:id/approve', approvalController.approveExpense);

// POST /api/approvals/:id/reject
router.post('/:id/reject', approvalController.rejectExpense);

module.exports = router;