export type UserRole = 'employee' | 'manager' | 'admin' | 'cfo';

export type ExpenseStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  description?: string;
  amount: number;
  currency_code: string;
  category?: string;
  expense_date: string;
  status: ExpenseStatus;
  created_at: string;
  updated_at: string;
  merchant?: string;
  notes?: string;
  receipt_url?: string;
  user_name?: string;
}

export interface ApprovalStep {
  stepNumber: number;
  name: string;
  approverIds: string[];
  approvalType: 'all' | 'percentage' | 'specific';
  percentageRequired?: number;
}

export interface ApprovalFlow {
  id: string;
  name: string;
  steps: ApprovalStep[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Approval {
  approval_id: string;
  expense_id: string;
  approver_id: string;
  status: ApprovalStatus;
  comments?: string;
  first_name: string;
  last_name: string;
  description?: string;
  amount: number;
  currency_code: string;
  category?: string;
  expense_date: string;
  id?: string;
  approver_name?: string;
  decided_at?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface ReportData {
  period: string;
  total: number;
  byCategory: Record<string, number>;
  topMerchants: Array<{ merchant: string; total: number }>;
  monthlyTrend: Array<{ month: string; amount: number }>;
}

