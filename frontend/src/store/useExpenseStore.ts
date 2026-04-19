import { useState } from 'react';
import { Expense, Approval, ApprovalFlow, Category, ReportData } from '../types';
import { apiService, ApiError } from '../services/api';


export function useExpenseStore() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      user_id: '1',
      description: 'Business Lunch',
      amount: 45.50,
      currency_code: 'USD',
      category: 'Meals',
      expense_date: '2024-01-15',
      status: 'approved',
      created_at: '2024-01-15T12:00:00Z',
      updated_at: '2024-01-15T12:00:00Z'
    },
    {
      id: '2',
      user_id: '1',
      description: 'Taxi to Airport',
      amount: 25.00,
      currency_code: 'USD',
      category: 'Travel',
      expense_date: '2024-01-16',
      status: 'pending',
      created_at: '2024-01-16T08:00:00Z',
      updated_at: '2024-01-16T08:00:00Z'
    }
  ]);
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      approval_id: '1',
      expense_id: '2',
      approver_id: '2',
      status: 'pending',
      comments: '',
      first_name: 'Sarah',
      last_name: 'Manager',
      description: 'Taxi to Airport',
      amount: 25.00,
      currency_code: 'USD',
      category: 'Travel',
      expense_date: '2024-01-16'
    }
  ]);
  const [flows, setFlows] = useState<ApprovalFlow[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'meals', name: 'Meals & Entertainment', color: '#10b981', icon: '🍽️' },
    { id: 'travel', name: 'Travel & Lodging', color: '#3b82f6', icon: '✈️' },
    { id: 'supplies', name: 'Office Supplies', color: '#f59e0b', icon: '📦' },
    { id: 'software', name: 'Software', color: '#8b5cf6', icon: '💻' },
    { id: 'marketing', name: 'Marketing', color: '#ef4444', icon: '📣' },
    { id: 'other', name: 'Other', color: '#6b7280', icon: '📋' }
  ]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchExpenses = async (page = 1, limit = 10, status?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Mock data - in real app this would call apiService.getExpenses
      let filteredExpenses = expenses;
      if (status) {
        filteredExpenses = expenses.filter(e => e.status === status);
      }
      return {
        expenses: filteredExpenses.slice((page - 1) * limit, page * limit),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredExpenses.length / limit),
          totalExpenses: filteredExpenses.length,
          hasMore: page * limit < filteredExpenses.length
        }
      };
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch expenses';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpense = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getExpense(id);
      return response.expense;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (data: {
    description: string;
    amount: number;
    currencyCode: string;
    category: string;
    expenseDate: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      // Mock create expense
      const newExpense: Expense = {
        id: Date.now().toString(),
        user_id: '1', // Mock user id
        description: data.description,
        amount: data.amount,
        currency_code: data.currencyCode,
        category: data.category,
        expense_date: data.expenseDate,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to create expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string, data: Partial<{
    description?: string;
    amount?: number;
    currencyCode?: string;
    category?: string;
    expenseDate?: string;
  }>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateExpense(id, data);
      // Refresh expenses list
      await fetchExpenses();
      return response.expense;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteExpense(id);
      // Refresh expenses list
      await fetchExpenses();
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const submitExpenseForApproval = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Mock submit for approval
      setExpenses(prev => prev.map(e => 
        e.id === id ? { ...e, status: 'pending' as Expense['status'] } : e
      ));
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to submit expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApprovals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getPendingApprovals();
      setApprovals(response.approvals);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch approvals';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const approveExpense = async (approvalId: string, comments?: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.approveExpense(approvalId, comments);
      // Refresh approvals and expenses
      await Promise.all([fetchPendingApprovals(), fetchExpenses()]);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to approve expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const rejectExpense = async (approvalId: string, comments: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.rejectExpense(approvalId, comments);
      // Refresh approvals and expenses
      await Promise.all([fetchPendingApprovals(), fetchExpenses()]);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to reject expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    return categories;
  };

  const createCategory = (newCat: Omit<Category, 'id'>) => {
    const category: Category = {
      id: Date.now().toString(),
      ...newCat
    };
    setCategories(prev => [...prev, category]);
    return category;
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Mock reports from expenses
      const userExpenses = expenses.filter(e => e.user_id === '1'); // Mock user
      const total = userExpenses.reduce((sum, e) => sum + e.amount, 0);
      const byCategory = userExpenses.reduce((acc, e) => {
        acc[e.category || 'Other'] = (acc[e.category || 'Other'] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>);

      const topMerchants = [...new Array(5)].map((_, i) => ({
        merchant: `Merchant ${i + 1}`,
        total: Math.random() * 1000 + 100
      })).slice(0, 5);

      const monthlyTrend = [
        { month: 'Jan', amount: 1200 },
        { month: 'Feb', amount: 1900 },
        { month: 'Mar', amount: 1500 },
        { month: 'Apr', amount: 2200 },
        { month: 'May', amount: 1800 }
      ];

      const reports: ReportData = {
        period: 'Last 6 months',
        total,
        byCategory,
        topMerchants,
        monthlyTrend
      };
      setReportData(reports);
      return reports;
    } finally {
      setLoading(false);
    }
  };

  const saveFlows = (newFlows: ApprovalFlow[]) => {
    setFlows(newFlows);
  };

  // Initialize with mock data - no need for useEffect

  return {
    expenses,
    approvals,
    flows,
    categories,
    reportData,
    loading,
    error,
    fetchExpenses,
    fetchExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    submitExpenseForApproval,
    fetchPendingApprovals,
    approveExpense,
    rejectExpense,
    saveFlows,
    getCategories,
    createCategory,
    deleteCategory,
    fetchReports
  };
}

