import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusTag } from '../components/ui/StatusTag';
import { useAuth } from '../context/AuthContext';
import { useExpenseStore } from '../store/useExpenseStore';
import { Plus, Eye, DollarSign } from 'lucide-react';
import { AddExpenseModalEnhanced } from '../components/AddExpenseModalEnhanced';
import { ExpenseDetailModal } from '../components/ExpenseDetailModal';
import { Expense } from '../types';

export function EmployeeDashboard() {
  const { user } = useAuth();
  const { expenses } = useExpenseStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const userExpenses = expenses.filter(e => e.user_id === user?.id);

  const thisMonthExpenses = userExpenses.filter(e => {
    const expenseDate = new Date(e.expense_date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const statusCounts = {
    draft: userExpenses.filter(e => e.status === 'draft').length,
    pending: userExpenses.filter(e => e.status === 'pending').length,
    approved: userExpenses.filter(e => e.status === 'approved').length,
    rejected: userExpenses.filter(e => e.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Expenses</h1>
          <p className="text-slate-600 mt-1">Track and manage your expense submissions</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">This Month</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  ${totalThisMonth.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-teal-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-slate-600 font-medium">Draft</p>
            <p className="text-2xl font-bold text-slate-500 mt-1">{statusCounts.draft}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-slate-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{statusCounts.pending}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-slate-600 font-medium">Approved</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{statusCounts.approved}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-slate-900">Recent Expenses</h2>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {userExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No expenses yet. Click "Add Expense" to create your first one.
                  </td>
                </tr>
              ) : (
                userExpenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {new Date(expense.expense_date ?? expense.created_at ?? Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{expense.description}</p>
                        <p className="text-xs text-slate-500">{new Date(expense.created_at).toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{expense.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {expense.currency_code} {expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusTag status={expense.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedExpense(expense)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddExpenseModalEnhanced
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          isOpen={!!selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
}
