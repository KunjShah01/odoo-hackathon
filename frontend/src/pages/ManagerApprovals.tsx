import React, { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusTag } from '../components/ui/StatusTag';
import { Modal } from '../components/ui/Modal';
import { TextArea } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useExpenseStore } from '../store/useExpenseStore';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { Expense, Approval } from '../types';

export function ManagerApprovals() {
  const { user } = useAuth();
  const { expenses, approvals, updateApproval } = useExpenseStore();
  const [selectedApproval, setSelectedApproval] = useState<{ approval: Approval; expense: Expense } | null>(null);
  const [comments, setComments] = useState('');

  const myApprovals = approvals.filter(a => a.approverId === user?.id);
  const pendingApprovals = myApprovals.filter(a => a.status === 'pending');

  const handleDecision = (approvalId: string, status: 'approved' | 'rejected') => {
    updateApproval(approvalId, status, comments);
    setSelectedApproval(null);
    setComments('');
  };

  const openApprovalModal = (approval: Approval) => {
    const expense = expenses.find(e => e.id === approval.expenseId);
    if (expense) {
      setSelectedApproval({ approval, expense });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Approvals</h1>
        <p className="text-slate-600 mt-1">Review and approve expense submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="px-6 py-4">
            <p className="text-sm text-slate-600 font-medium">Pending Approval</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">{pendingApprovals.length}</p>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4">
            <p className="text-sm text-slate-600 font-medium">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {myApprovals.filter(a => a.status === 'approved').length}
            </p>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4">
            <p className="text-sm text-slate-600 font-medium">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {myApprovals.filter(a => a.status === 'rejected').length}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-slate-900">Pending Approvals</h2>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Employee
                </th>
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
                  Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pendingApprovals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No pending approvals at this time.
                  </td>
                </tr>
              ) : (
                pendingApprovals.map(approval => {
                  const expense = expenses.find(e => e.id === approval.expenseId);
                  if (!expense) return null;

                  return (
                    <tr key={approval.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {expense.userName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{expense.description}</p>
                          {expense.merchant && (
                            <p className="text-xs text-slate-500">{expense.merchant}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{expense.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {expense.currency} {expense.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {expense.receiptUrl ? (
                          <button
                            onClick={() => window.open(expense.receiptUrl, '_blank')}
                            className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        ) : (
                          <span className="text-slate-400 text-sm">No receipt</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => openApprovalModal(approval)}
                            variant="secondary"
                          >
                            Review
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedApproval && (
        <Modal
          isOpen={!!selectedApproval}
          onClose={() => {
            setSelectedApproval(null);
            setComments('');
          }}
          title="Review Expense"
          size="lg"
        >
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Employee</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {selectedApproval.expense.userName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 font-medium">Description</p>
                  <p className="text-slate-900">{selectedApproval.expense.description}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 font-medium">Merchant</p>
                  <p className="text-slate-900">
                    {selectedApproval.expense.merchant || 'Not specified'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 font-medium">Date</p>
                  <p className="text-slate-900">
                    {new Date(selectedApproval.expense.date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 font-medium">Category</p>
                  <p className="text-slate-900">{selectedApproval.expense.category}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 font-medium">Amount</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedApproval.expense.currency} {selectedApproval.expense.amount.toFixed(2)}
                  </p>
                </div>

                {selectedApproval.expense.notes && (
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-1">Notes</p>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                      {selectedApproval.expense.notes}
                    </p>
                  </div>
                )}
              </div>

              {selectedApproval.expense.receiptUrl && (
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-3">Receipt</p>
                  <img
                    src={selectedApproval.expense.receiptUrl}
                    alt="Receipt"
                    className="w-full rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(selectedApproval.expense.receiptUrl, '_blank')}
                  />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <TextArea
                label="Comments (Optional)"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments for this decision..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedApproval(null);
                  setComments('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDecision(selectedApproval.approval.id, 'rejected')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                Reject
              </Button>
              <Button
                onClick={() => handleDecision(selectedApproval.approval.id, 'approved')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Approve
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
