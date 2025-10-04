const db = require('../models/database');

const getPendingApprovals = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(`
      SELECT
        a.id as approval_id,
        e.*,
        u.first_name,
        u.last_name,
        u.email
      FROM approvals a
      JOIN expenses e ON a.expense_id = e.id
      JOIN users u ON e.submitter_id = u.id
      WHERE a.approver_id = $1 AND a.status = 'pending'
      ORDER BY e.submitted_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const approveExpense = async (req, res) => {
  try {
    const { id } = req.params; // workflow id
    const userId = req.user.id;
    const { comments } = req.body;

    // Check if workflow exists and user is the approver
    const workflowResult = await db.query(
      'SELECT * FROM approvals WHERE id = $1 AND approver_id = $2 AND status = $3',
      [id, userId, 'pending']
    );

    if (workflowResult.rows.length === 0) {
      return res.status(404).json({ error: 'Approval workflow not found or not authorized' });
    }

    const workflow = workflowResult.rows[0];

    // Update workflow status
    await db.query(
      'UPDATE approvals SET status = $1, acted_at = NOW(), comment = $2 WHERE id = $3',
      ['approved', comments || '', id]
    );

    // Update expense status
    await db.query('UPDATE expenses SET status = $1 WHERE id = $2', ['approved', workflow.expense_id]);

    // Log the approval
    await db.query(
      'INSERT INTO audit_logs (expense_id, user_id, event_type, payload) VALUES ($1, $2, $3, $4)',
      [workflow.expense_id, userId, 'expense_approved', { comments: comments || 'Approved by manager', approver_id: userId }]
    );

    // Get the updated expense and approval
    const expenseResult = await db.query('SELECT * FROM expenses WHERE id = $1', [workflow.expense_id]);
    const approvalResult = await db.query('SELECT * FROM approvals WHERE id = $1', [id]);
    
    res.json({ 
      message: 'Expense approved successfully',
      status: 'approved',
      expense: expenseResult.rows[0],
      approval: approvalResult.rows[0]
    });
  } catch (error) {
    console.error('Approve expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectExpense = async (req, res) => {
  try {
    const { id } = req.params; // workflow id
    const userId = req.user.id;
    const { comments } = req.body;

    if (!comments || comments.trim().length === 0) {
      return res.status(400).json({ error: 'Rejection comments are required' });
    }

    // Check if workflow exists and user is the approver
    const workflowResult = await db.query(
      'SELECT * FROM approvals WHERE id = $1 AND approver_id = $2 AND status = $3',
      [id, userId, 'pending']
    );

    if (workflowResult.rows.length === 0) {
      return res.status(404).json({ error: 'Approval workflow not found or not authorized' });
    }

    const workflow = workflowResult.rows[0];

    // Update workflow status
    await db.query(
      'UPDATE approvals SET status = $1, acted_at = NOW(), comment = $2 WHERE id = $3',
      ['rejected', comments, id]
    );

    // Update expense status
    await db.query('UPDATE expenses SET status = $1 WHERE id = $2', ['rejected', workflow.expense_id]);

    // Log the rejection
    await db.query(
      'INSERT INTO audit_logs (expense_id, user_id, event_type, payload) VALUES ($1, $2, $3, $4)',
      [workflow.expense_id, userId, 'expense_rejected', { comments: comments, approver_id: userId }]
    );

    // Get the updated expense and approval
    const expenseResult = await db.query('SELECT * FROM expenses WHERE id = $1', [workflow.expense_id]);
    const approvalResult = await db.query('SELECT * FROM approvals WHERE id = $1', [id]);
    
    res.json({ 
      message: 'Expense rejected successfully',
      status: 'rejected',
      expense: expenseResult.rows[0],
      approval: approvalResult.rows[0]
    });
  } catch (error) {
    console.error('Reject expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getPendingApprovals,
  approveExpense,
  rejectExpense
};