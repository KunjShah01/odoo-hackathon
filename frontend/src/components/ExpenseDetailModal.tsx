import React from 'react';
import { Modal } from './ui/Modal';
import { StatusTag } from './ui/StatusTag';
import { Expense } from '../types';
import { useExpenseStore } from '../store/useExpenseStore';
import { Calendar, User, DollarSign, FileText, Image } from 'lucide-react';

interface ExpenseDetailModalProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
}

export function ExpenseDetailModal({ expense, isOpen, onClose }: ExpenseDetailModalProps) {
  const { approvals } = useExpenseStore();
  const expenseApprovals = approvals.filter(a => a.expenseId === expense.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Expense Details" size="lg">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{expense.description}</h3>
            <p className="text-slate-600 mt-1">{expense.merchant}</p>
          </div>
          <StatusTag status={expense.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="text-indigo-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Date</p>
                <p className="text-slate-900">{new Date(expense.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="text-teal-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Amount</p>
                <p className="text-2xl font-bold text-slate-900">
                  {expense.currency} {expense.amount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Category</p>
                <p className="text-slate-900">{expense.category}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Submitted By</p>
                <p className="text-slate-900">{expense.userName}</p>
              </div>
            </div>

            {expense.notes && (
              <div className="pt-2">
                <p className="text-sm text-slate-600 font-medium mb-1">Notes</p>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{expense.notes}</p>
              </div>
            )}
          </div>

          {expense.receiptUrl && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image className="text-slate-600" size={20} />
                <p className="text-sm text-slate-600 font-medium">Receipt</p>
              </div>
              <img
                src={expense.receiptUrl}
                alt="Receipt"
                className="w-full rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(expense.receiptUrl, '_blank')}
              />
            </div>
          )}
        </div>

        {expenseApprovals.length > 0 && (
          <div className="pt-6 border-t border-slate-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Audit Trail</h4>
            <div className="space-y-3">
              {expenseApprovals.map(approval => (
                <div
                  key={approval.id}
                  className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-900">{approval.approverName}</p>
                      <StatusTag status={approval.status} />
                    </div>
                    {approval.comments && (
                      <p className="text-sm text-slate-600 mt-1">{approval.comments}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {approval.decidedAt
                        ? new Date(approval.decidedAt).toLocaleString()
                        : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
