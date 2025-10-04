-- Verification queries for expense_db setup
-- Run this file: psql -U expense_user -d expense_db -f verify_setup.sql

SELECT '================================================' AS message;
SELECT 'DATABASE VERIFICATION REPORT' AS message;
SELECT '================================================' AS message;
SELECT '' AS message;

SELECT '1. TABLE COUNTS:' AS message;
SELECT '----------------' AS message;
SELECT 'Companies' as table_name, COUNT(*)::text as count FROM companies
UNION ALL SELECT 'Users', COUNT(*)::text FROM users
UNION ALL SELECT 'Expenses', COUNT(*)::text FROM expenses
UNION ALL SELECT 'Receipts', COUNT(*)::text FROM receipts
UNION ALL SELECT 'Approval Flows', COUNT(*)::text FROM approval_flows
UNION ALL SELECT 'Approval Steps', COUNT(*)::text FROM approval_steps
UNION ALL SELECT 'Approvals', COUNT(*)::text FROM approvals
UNION ALL SELECT 'Audit Logs', COUNT(*)::text FROM audit_logs
UNION ALL SELECT 'Currency Rates', COUNT(*)::text FROM currency_rates;

SELECT '' AS message;
SELECT '2. COMPANY INFO:' AS message;
SELECT '----------------' AS message;
SELECT name, country_code, currency_code FROM companies;

SELECT '' AS message;
SELECT '3. USERS BY ROLE:' AS message;
SELECT '-----------------' AS message;
SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role;

SELECT '' AS message;
SELECT '4. USER DETAILS:' AS message;
SELECT '----------------' AS message;
SELECT full_name, email, role, is_manager_approver FROM users ORDER BY role, full_name;

SELECT '' AS message;
SELECT '5. EXPENSES BY STATUS:' AS message;
SELECT '----------------------' AS message;
SELECT status, COUNT(*) as count, SUM(amount)::numeric(10,2) as total_amount FROM expenses GROUP BY status ORDER BY status;

SELECT '' AS message;
SELECT '6. SAMPLE EXPENSE DETAILS:' AS message;
SELECT '--------------------------' AS message;
SELECT 
    e.description,
    u.full_name as submitter,
    e.amount,
    e.currency_code,
    e.status,
    e.category
FROM expenses e
JOIN users u ON e.submitter_id = u.id
ORDER BY CASE WHEN e.submitted_at IS NULL THEN 1 ELSE 0 END ASC, e.submitted_at DESC
LIMIT 5;

SELECT '' AS message;
SELECT '7. APPROVAL FLOWS:' AS message;
SELECT '------------------' AS message;
SELECT name, (SELECT COUNT(*) FROM approval_steps WHERE flow_id = af.id) as steps_count
FROM approval_flows af;

SELECT '' AS message;
SELECT '8. PENDING APPROVALS:' AS message;
SELECT '---------------------' AS message;
SELECT 
    e.description as expense,
    u.full_name as approver,
    a.status
FROM approvals a
JOIN expenses e ON a.expense_id = e.id
JOIN users u ON a.approver_id = u.id
WHERE a.status = 'pending';

SELECT '' AS message;
SELECT '================================================' AS message;
SELECT 'VERIFICATION COMPLETE!' AS message;
SELECT '================================================' AS message;
SELECT '' AS message;
SELECT 'Connection String for Backend:' AS message;
SELECT 'postgresql://expense_user:expense_pass@localhost:5432/expense_db' AS message;
SELECT '' AS message;
