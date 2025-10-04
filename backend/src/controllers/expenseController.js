const Joi = require('joi');
const db = require('../models/database');

const expenseSchema = Joi.object({
  description: Joi.string().allow(''),
  amount: Joi.number().positive().required(),
  currencyCode: Joi.string().length(3).default('USD'),
  category: Joi.string().required(),
  expenseDate: Joi.date().required()
});

const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    let query = `
      SELECT e.*
      FROM expenses e
      WHERE e.submitter_id = $1
    `;
    const params = [userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND e.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY e.updated_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, (page - 1) * limit);

    const result = await db.query(query, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM expenses
      WHERE submitter_id = $1 ${status ? 'AND status = $2' : ''}
    `;
    const countParams = status ? [userId, status] : [userId];
    const countResult = await db.query(countQuery, countParams);

    res.json({
      expenses: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      'SELECT e.* FROM expenses e WHERE e.id = $1 AND e.submitter_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense: result.rows[0] });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createExpense = async (req, res) => {
  try {
    const { error, value } = expenseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { description, amount, currencyCode, category, expenseDate } = value;
    const userId = req.user.id;

    // Get user's company_id
    const userResult = await db.query('SELECT company_id FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const companyId = userResult.rows[0].company_id;

    const result = await db.query(
      'INSERT INTO expenses (submitter_id, company_id, description, amount, currency_code, category, expense_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [userId, companyId, description, amount, currencyCode, category, expenseDate, 'draft']
    );

    res.status(201).json({
      message: 'Expense created successfully',
      expense: result.rows[0]
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    // Check if expense exists and belongs to user
    const existingExpense = await db.query('SELECT * FROM expenses WHERE id = $1 AND submitter_id = $2', [id, userId]);
    if (existingExpense.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (existingExpense.rows[0].status !== 'draft') {
      return res.status(400).json({ error: 'Can only update draft expenses' });
    }

    // Build update query dynamically
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (['title', 'description', 'amount', 'currency', 'receipt_url', 'expense_date'].includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id, userId);
    const query = `UPDATE expenses SET ${fields.join(', ')} WHERE id = $${paramIndex} AND submitter_id = $${paramIndex + 1} RETURNING *`;

    const result = await db.query(query, values);
    res.json({
      message: 'Expense updated successfully',
      expense: result.rows[0]
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if expense exists and belongs to user
    const existingExpense = await db.query('SELECT * FROM expenses WHERE id = $1 AND submitter_id = $2', [id, userId]);
    if (existingExpense.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (existingExpense.rows[0].status !== 'draft') {
      return res.status(400).json({ error: 'Can only delete draft expenses' });
    }

    await db.query('DELETE FROM expenses WHERE id = $1 AND submitter_id = $2', [id, userId]);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const submitForApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if expense exists and belongs to user
    const existingExpense = await db.query('SELECT * FROM expenses WHERE id = $1 AND submitter_id = $2', [id, userId]);
    if (existingExpense.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (existingExpense.rows[0].status !== 'draft') {
      return res.status(400).json({ error: 'Expense is not in draft status' });
    }

    // Update status to pending
    await db.query('UPDATE expenses SET status = $1, submitted_at = NOW() WHERE id = $2', ['pending', id]);

    // For hackathon simplicity, create a workflow entry for the user's manager
    // In a real system, this would be more complex
    const managerResult = await db.query(`
      SELECT manager_id FROM users WHERE id = $1 AND manager_id IS NOT NULL
    `, [userId]);

    if (managerResult.rows.length > 0 && managerResult.rows[0].manager_id) {
      await db.query(
        'INSERT INTO approvals (expense_id, approver_id, status) VALUES ($1, $2, $3)',
        [id, managerResult.rows[0].manager_id, 'pending']
      );
    }

    // Get updated expense
    const updatedExpense = await db.query('SELECT * FROM expenses WHERE id = $1', [id]);
    res.json({ 
      message: 'Expense submitted for approval',
      expense: updatedExpense.rows[0]
    });
  } catch (error) {
    console.error('Submit for approval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  submitForApproval
};