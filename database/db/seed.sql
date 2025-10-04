-- Seed Data for Expense Management System
-- This creates demo company, users, expenses, and approval flows for testing

-- ============================================
-- 1. CREATE DEMO COMPANY
-- ============================================
INSERT INTO companies (id, name, country_code, currency_code, created_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'TechCorp Solutions', 'US', 'USD', now());

-- ============================================
-- 2. CREATE USERS (Employee, Manager, CFO, Admin)
-- ============================================
INSERT INTO users (id, company_id, full_name, email, role, is_manager_approver, manager_id, created_at)
VALUES 
    -- Admin
    ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 
     'Sarah Admin', 'sarah.admin@techcorp.com', 'admin', false, NULL, now()),
    
    -- CFO
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 
     'Robert CFO', 'robert.cfo@techcorp.com', 'cfo', true, NULL, now()),
    
    -- Manager
    ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 
     'Mike Manager', 'mike.manager@techcorp.com', 'manager', true, 
     '33333333-3333-3333-3333-333333333333', now()),
    
    -- Employees
    ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 
     'Alice Employee', 'alice.employee@techcorp.com', 'employee', false, 
     '44444444-4444-4444-4444-444444444444', now()),
     
    ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 
     'Bob Developer', 'bob.dev@techcorp.com', 'employee', false, 
     '44444444-4444-4444-4444-444444444444', now()),
     
    ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 
     'Emma Designer', 'emma.designer@techcorp.com', 'employee', false, 
     '44444444-4444-4444-4444-444444444444', now());

-- ============================================
-- 3. CREATE APPROVAL FLOWS
-- ============================================
INSERT INTO approval_flows (id, company_id, name, created_at)
VALUES 
    ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 
     'Standard Expense Approval Flow', now()),
    ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 
     'High-Value Expense Flow', now());

-- ============================================
-- 4. CREATE APPROVAL STEPS
-- ============================================
-- Standard Flow: Manager -> CFO
INSERT INTO approval_steps (id, flow_id, step_order, approver_role, approver_user_id, created_at)
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '88888888-8888-8888-8888-888888888888', 
     1, 'manager', NULL, now()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', 
     2, 'cfo', NULL, now());

-- High-Value Flow: Manager -> CFO -> Admin
INSERT INTO approval_steps (id, flow_id, step_order, approver_role, approver_user_id, created_at)
VALUES 
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', 
     1, 'manager', NULL, now()),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '99999999-9999-9999-9999-999999999999', 
     2, 'cfo', '33333333-3333-3333-3333-333333333333', now()),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '99999999-9999-9999-9999-999999999999', 
     3, 'admin', '22222222-2222-2222-2222-222222222222', now());

-- ============================================
-- 5. CREATE APPROVAL RULES (Conditional)
-- ============================================
-- Standard flow: 60% approval required
INSERT INTO approval_rules (id, flow_id, rule_type, percentage_required, specific_approver_id)
VALUES 
    ('f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0', '88888888-8888-8888-8888-888888888888', 
     'percentage', 60, NULL);

-- High-value flow: CFO must approve (specific approver)
INSERT INTO approval_rules (id, flow_id, rule_type, percentage_required, specific_approver_id)
VALUES 
    ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', '99999999-9999-9999-9999-999999999999', 
     'specific', NULL, '33333333-3333-3333-3333-333333333333');

-- ============================================
-- 6. CREATE SAMPLE EXPENSES
-- ============================================
-- Expense 1: Draft (Alice)
INSERT INTO expenses (id, company_id, submitter_id, description, category, expense_date, 
                     amount, currency_code, normalized_amount, status, submitted_at, updated_at)
VALUES 
    ('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
     '55555555-5555-5555-5555-555555555555', 'Team lunch at Italian restaurant', 'Meals',
     '2025-10-01', 120.50, 'USD', 120.50, 'draft', NULL, now());

-- Expense 2: Pending (Bob)
INSERT INTO expenses (id, company_id, submitter_id, description, category, expense_date, 
                     amount, currency_code, normalized_amount, status, submitted_at, updated_at)
VALUES 
    ('e2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
     '66666666-6666-6666-6666-666666666666', 'Conference registration fee', 'Travel',
     '2025-09-28', 450.00, 'USD', 450.00, 'pending', now() - interval '2 days', now());

-- Expense 3: Pending (Emma)
INSERT INTO expenses (id, company_id, submitter_id, description, category, expense_date, 
                     amount, currency_code, normalized_amount, status, submitted_at, updated_at)
VALUES 
    ('e3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
     '77777777-7777-7777-7777-777777777777', 'Design software subscription', 'Software',
     '2025-10-02', 85.00, 'USD', 85.00, 'pending', now() - interval '1 day', now());

-- Expense 4: Approved (Alice - previous month)
INSERT INTO expenses (id, company_id, submitter_id, description, category, expense_date, 
                     amount, currency_code, normalized_amount, status, submitted_at, updated_at)
VALUES 
    ('e4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111',
     '55555555-5555-5555-5555-555555555555', 'Client dinner meeting', 'Meals',
     '2025-09-15', 200.00, 'USD', 200.00, 'approved', now() - interval '15 days', now() - interval '10 days');

-- Expense 5: Rejected (Bob - previous)
INSERT INTO expenses (id, company_id, submitter_id, description, category, expense_date, 
                     amount, currency_code, normalized_amount, status, submitted_at, updated_at)
VALUES 
    ('e5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111',
     '66666666-6666-6666-6666-666666666666', 'Personal lunch (incorrect category)', 'Meals',
     '2025-09-20', 35.00, 'USD', 35.00, 'rejected', now() - interval '12 days', now() - interval '10 days');

-- ============================================
-- 7. CREATE EXPENSE LINES (detailed breakdown)
-- ============================================
INSERT INTO expense_lines (id, expense_id, category, merchant, line_amount, note)
VALUES 
    (gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 
     'Meals', 'La Bella Italia', 120.50, 'Team of 4 people'),
     
    (gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 
     'Travel', 'Tech Summit 2025', 450.00, 'Annual tech conference'),
     
    (gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 
     'Software', 'Adobe Creative Cloud', 85.00, 'Monthly subscription'),
     
    (gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 
     'Meals', 'The Steakhouse', 200.00, 'Client meeting with ABC Corp');

-- ============================================
-- 8. CREATE RECEIPTS (with mock OCR data)
-- ============================================
INSERT INTO receipts (id, expense_id, file_url, ocr_json, uploaded_at)
VALUES 
    (gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 
     '/receipts/2025/10/receipt_001.jpg',
     '{"amount": 120.50, "date": "2025-10-01", "merchant": "La Bella Italia", "category": "Meals"}',
     now()),
     
    (gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 
     '/receipts/2025/09/receipt_002.pdf',
     '{"amount": 450.00, "date": "2025-09-28", "merchant": "Tech Summit 2025", "category": "Travel"}',
     now() - interval '2 days'),
     
    (gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 
     '/receipts/2025/10/receipt_003.png',
     '{"amount": 85.00, "date": "2025-10-02", "merchant": "Adobe", "category": "Software"}',
     now() - interval '1 day'),
     
    (gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 
     '/receipts/2025/09/receipt_004.jpg',
     '{"amount": 200.00, "date": "2025-09-15", "merchant": "The Steakhouse", "category": "Meals"}',
     now() - interval '15 days');

-- ============================================
-- 9. CREATE APPROVAL ACTIONS
-- ============================================
-- Bob's expense (pending) - Manager approved, waiting CFO
INSERT INTO approvals (id, expense_id, step_id, approver_id, status, comment, acted_at)
VALUES 
    (gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222',
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444',
     'approved', 'Conference looks valuable for team development', now() - interval '1 day'),
     
    (gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222',
     'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333',
     'pending', NULL, NULL);

-- Emma's expense (pending) - waiting manager
INSERT INTO approvals (id, expense_id, step_id, approver_id, status, comment, acted_at)
VALUES 
    (gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333',
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444',
     'pending', NULL, NULL);

-- Alice's approved expense - both steps approved
INSERT INTO approvals (id, expense_id, step_id, approver_id, status, comment, acted_at)
VALUES 
    (gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444',
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444',
     'approved', 'Client entertainment approved', now() - interval '14 days'),
     
    (gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444',
     'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333',
     'approved', 'Final approval granted', now() - interval '10 days');

-- Bob's rejected expense
INSERT INTO approvals (id, expense_id, step_id, approver_id, status, comment, acted_at)
VALUES 
    (gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555',
     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444',
     'rejected', 'This appears to be a personal expense. Please review company policy.', 
     now() - interval '10 days');

-- ============================================
-- 10. CREATE AUDIT LOGS
-- ============================================
INSERT INTO audit_logs (expense_id, user_id, event_type, payload, created_at)
VALUES 
    ('e2222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666',
     'expense_created', '{"amount": 450.00, "category": "Travel"}', now() - interval '2 days'),
     
    ('e2222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666',
     'expense_submitted', '{"flow_id": "88888888-8888-8888-8888-888888888888"}', now() - interval '2 days'),
     
    ('e2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444',
     'approval_granted', '{"step": 1, "comment": "Conference looks valuable"}', now() - interval '1 day'),
     
    ('e4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444',
     'approval_granted', '{"step": 1}', now() - interval '14 days'),
     
    ('e4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333',
     'approval_granted', '{"step": 2}', now() - interval '10 days'),
     
    ('e4444444-4444-4444-4444-444444444444', NULL,
     'expense_approved_final', '{"total_amount": 200.00}', now() - interval '10 days'),
     
    ('e5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444',
     'approval_rejected', '{"step": 1, "reason": "Personal expense"}', now() - interval '10 days');

-- ============================================
-- 11. CREATE CURRENCY RATES (for conversion)
-- ============================================
INSERT INTO currency_rates (base_currency, target_currency, rate, fetched_at)
VALUES 
    ('USD', 'EUR', 0.92, now()),
    ('USD', 'GBP', 0.79, now()),
    ('USD', 'INR', 83.12, now()),
    ('USD', 'CAD', 1.36, now()),
    ('EUR', 'USD', 1.09, now()),
    ('GBP', 'USD', 1.27, now()),
    ('INR', 'USD', 0.012, now());

-- ============================================
-- VERIFICATION QUERIES (comment out before production)
-- ============================================
-- SELECT 'Companies:', COUNT(*) FROM companies;
-- SELECT 'Users:', COUNT(*) FROM users;
-- SELECT 'Expenses:', COUNT(*) FROM expenses;
-- SELECT 'Receipts:', COUNT(*) FROM receipts;
-- SELECT 'Approval Flows:', COUNT(*) FROM approval_flows;
-- SELECT 'Approval Steps:', COUNT(*) FROM approval_steps;
-- SELECT 'Approvals:', COUNT(*) FROM approvals;
-- SELECT 'Audit Logs:', COUNT(*) FROM audit_logs;
