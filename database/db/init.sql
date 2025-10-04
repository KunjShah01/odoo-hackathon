-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Companies
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country_code VARCHAR(10),
    currency_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),  -- For authentication
    role VARCHAR(50) NOT NULL CHECK (role IN ('employee','manager','admin','cfo')),
    is_manager_approver BOOLEAN DEFAULT false, -- matches PDF requirement
    manager_id UUID REFERENCES users(id),      -- hierarchy mapping
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    submitter_id UUID NOT NULL REFERENCES users(id),
    description TEXT,
    category VARCHAR(100),
    expense_date DATE NOT NULL,
    amount NUMERIC(14,2) NOT NULL,             -- as submitted
    currency_code VARCHAR(10) NOT NULL,        -- submitted currency
    normalized_amount NUMERIC(14,2),           -- converted to company currency
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','approved','rejected')),
    submitted_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Expense lines (optional breakdown)
CREATE TABLE expense_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    category VARCHAR(100),
    merchant VARCHAR(255),
    line_amount NUMERIC(12,2),
    note TEXT
);

-- Receipts (with OCR parsing)
CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    file_url TEXT,
    ocr_json JSONB,  -- parsed OCR data (amount, merchant, date)
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Approval flows (company defined)
CREATE TABLE approval_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Approval steps (sequential, can reference role or user)
CREATE TABLE approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flow_id UUID NOT NULL REFERENCES approval_flows(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    approver_role VARCHAR(50), -- e.g. manager, cfo
    approver_user_id UUID REFERENCES users(id), -- optional: specific approver
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Approval rules (conditional flows: percentage, specific approver, hybrid)
CREATE TABLE approval_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flow_id UUID NOT NULL REFERENCES approval_flows(id),
    rule_type VARCHAR(20) NOT NULL CHECK (rule_type IN ('percentage','specific','hybrid')),
    percentage_required INT,
    specific_approver_id UUID REFERENCES users(id)
);

-- Approvals (actions taken)
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES expenses(id),
    step_id UUID REFERENCES approval_steps(id),
    approver_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending','approved','rejected')),
    comment TEXT,
    acted_at TIMESTAMPTZ
);

-- Approval workflows (simplified for hackathon)
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES expenses(id),
    approver_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    comments TEXT,
    acted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    expense_id UUID REFERENCES expenses(id),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(100),
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Currency rates (for conversion)
CREATE TABLE currency_rates (
    base_currency VARCHAR(10) NOT NULL,
    target_currency VARCHAR(10) NOT NULL,
    rate NUMERIC(18,8),
    fetched_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (base_currency, target_currency)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_manager_id ON users(manager_id);

-- Expenses indexes
CREATE INDEX idx_expenses_company_id ON expenses(company_id);
CREATE INDEX idx_expenses_submitter_id ON expenses(submitter_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_company_status ON expenses(company_id, status);
CREATE INDEX idx_expenses_submitted_at ON expenses(submitted_at);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);

-- Expense lines indexes
CREATE INDEX idx_expense_lines_expense_id ON expense_lines(expense_id);
CREATE INDEX idx_expense_lines_category ON expense_lines(category);

-- Receipts indexes
CREATE INDEX idx_receipts_expense_id ON receipts(expense_id);

-- Approval flows indexes
CREATE INDEX idx_approval_flows_company_id ON approval_flows(company_id);

-- Approval steps indexes
CREATE INDEX idx_approval_steps_flow_id ON approval_steps(flow_id);
CREATE INDEX idx_approval_steps_approver_user_id ON approval_steps(approver_user_id);

-- Approval rules indexes
CREATE INDEX idx_approval_rules_flow_id ON approval_rules(flow_id);
CREATE INDEX idx_approval_rules_specific_approver ON approval_rules(specific_approver_id);

-- Approvals indexes
CREATE INDEX idx_approvals_expense_id ON approvals(expense_id);
CREATE INDEX idx_approvals_approver_id ON approvals(approver_id);
CREATE INDEX idx_approvals_step_id ON approvals(step_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_approver_status ON approvals(approver_id, status);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_expense_id ON audit_logs(expense_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Currency rates indexes (already has PK, but add fetched_at for cache invalidation)
CREATE INDEX idx_currency_rates_fetched_at ON currency_rates(fetched_at);
