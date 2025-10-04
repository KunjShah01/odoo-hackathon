import { useState, useEffect } from 'react';
import { Expense, Approval, ApprovalFlow } from '../types';

const STORAGE_KEY = 'expenses';
const APPROVALS_KEY = 'approvals';
const FLOWS_KEY = 'approval_flows';

const INITIAL_EXPENSES: Expense[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Employee',
    date: '2025-10-01',
    description: 'Client Dinner',
    category: 'Meals',
    merchant: 'The Steakhouse',
    amount: 156.50,
    currency: 'USD',
    receiptUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    status: 'pending',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-01T10:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Employee',
    date: '2025-09-28',
    description: 'Conference Flight',
    category: 'Travel',
    merchant: 'Delta Airlines',
    amount: 450.00,
    currency: 'USD',
    receiptUrl: 'https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg',
    status: 'approved',
    createdAt: '2025-09-28T08:00:00Z',
    updatedAt: '2025-09-28T15:00:00Z'
  }
];

const INITIAL_APPROVALS: Approval[] = [
  {
    id: '1',
    expenseId: '1',
    approverId: '2',
    approverName: 'Sarah Manager',
    status: 'pending',
    stepNumber: 1,
    createdAt: '2025-10-01T10:00:00Z'
  }
];

const INITIAL_FLOWS: ApprovalFlow[] = [
  {
    id: '1',
    name: 'Standard Approval Flow',
    steps: [
      {
        stepNumber: 1,
        name: 'Manager Review',
        approverIds: ['2'],
        approvalType: 'specific'
      },
      {
        stepNumber: 2,
        name: 'Finance Approval',
        approverIds: ['3'],
        approvalType: 'specific'
      }
    ],
    isActive: true,
    createdBy: '3',
    createdAt: '2025-09-01T00:00:00Z'
  }
];

export function useExpenseStore() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [flows, setFlows] = useState<ApprovalFlow[]>([]);

  useEffect(() => {
    const storedExpenses = localStorage.getItem(STORAGE_KEY);
    const storedApprovals = localStorage.getItem(APPROVALS_KEY);
    const storedFlows = localStorage.getItem(FLOWS_KEY);

    setExpenses(storedExpenses ? JSON.parse(storedExpenses) : INITIAL_EXPENSES);
    setApprovals(storedApprovals ? JSON.parse(storedApprovals) : INITIAL_APPROVALS);
    setFlows(storedFlows ? JSON.parse(storedFlows) : INITIAL_FLOWS);
  }, []);

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
  };

  const saveApprovals = (newApprovals: Approval[]) => {
    setApprovals(newApprovals);
    localStorage.setItem(APPROVALS_KEY, JSON.stringify(newApprovals));
  };

  const saveFlows = (newFlows: ApprovalFlow[]) => {
    setFlows(newFlows);
    localStorage.setItem(FLOWS_KEY, JSON.stringify(newFlows));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveExpenses([...expenses, newExpense]);
    return newExpense;
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const updated = expenses.map(e =>
      e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    );
    saveExpenses(updated);
  };

  const submitExpenseForApproval = (expenseId: string, approverId: string, approverName: string) => {
    updateExpense(expenseId, { status: 'pending' });

    const newApproval: Approval = {
      id: Date.now().toString(),
      expenseId,
      approverId,
      approverName,
      status: 'pending',
      stepNumber: 1,
      createdAt: new Date().toISOString()
    };
    saveApprovals([...approvals, newApproval]);
  };

  const updateApproval = (id: string, status: 'approved' | 'rejected', comments?: string) => {
    const approval = approvals.find(a => a.id === id);
    if (!approval) return;

    const updated = approvals.map(a =>
      a.id === id
        ? { ...a, status, comments, decidedAt: new Date().toISOString() }
        : a
    );
    saveApprovals(updated);

    const expense = expenses.find(e => e.id === approval.expenseId);
    if (expense) {
      updateExpense(expense.id, { status });
    }
  };

  return {
    expenses,
    approvals,
    flows,
    addExpense,
    updateExpense,
    submitExpenseForApproval,
    updateApproval,
    saveFlows
  };
}
