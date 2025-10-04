export type UserRole = 'employee' | 'manager' | 'admin';

export type ExpenseStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  country: string;
  defaultCurrency: string;
}

export interface Expense {
  id: string;
  userId: string;
  userName: string;
  date: string;
  description: string;
  category: string;
  merchant?: string;
  amount: number;
  currency: string;
  receiptUrl?: string;
  notes?: string;
  status: ExpenseStatus;
  createdAt: string;
  updatedAt: string;
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
  id: string;
  expenseId: string;
  approverId: string;
  approverName: string;
  status: ApprovalStatus;
  comments?: string;
  stepNumber: number;
  decidedAt?: string;
  createdAt: string;
}
