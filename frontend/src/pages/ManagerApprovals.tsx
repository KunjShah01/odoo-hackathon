import { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TextArea } from '../components/ui/Input';
import { useExpenseStore } from '../store/useExpenseStore';
import { CheckCircle, XCircle } from 'lucide-react';
import { Approval } from '../types';

export function ManagerApprovals() {
  const { approvals, approveExpense, rejectExpense, fetchPendingApprovals } = useExpenseStore();
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  const handleApprove = async (approvalId: string) => {
    try {
      await approveExpense(approvalId, comments || undefined);
      setSelectedApproval(null);
      setComments('');
    } catch (err) {
      console.error('Failed to approve expense:', err);
    }
  };

  const handleReject = async (approvalId: string) => {
    if (!comments.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      await rejectExpense(approvalId, comments);
      setSelectedApproval(null);
      setComments('');
    } catch (err) {
      console.error('Failed to reject expense:', err);
    }
  };

  const openApprovalModal = (approval: Approval) => {
    setSelectedApproval(approval);
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
            <p className="text-3xl font-bold text-orange-600 mt-1">{approvals.length}</p>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4">
            <p className="text-sm text-slate-600 font-medium">Approved Today</p>
            <p className="text-3xl font-bold text-green-600 mt-1">0</p>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4">
            <p className="text-sm text-slate-600 font-medium">Rejected Today</p>
            <p className="text-3xl font-bold text-red-600 mt-1">0</p>
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
              {approvals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No pending approvals at this time.
                  </td>
                </tr>
              ) : (
                approvals.map(approval => (
                  <tr key={approval.approval_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {approval.first_name} {approval.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(approval.expense_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{approval.description || 'No description'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{approval.category || 'Uncategorized'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {approval.currency_code} {approval.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 text-sm">No receipt</span>
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
                ))
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
                    {selectedApproval.first_name} {selectedApproval.last_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 font-medium">Description</p>
                  <p className="text-slate-900">{selectedApproval.description || 'No description'}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 font-medium">Date</p>
                  <p className="text-slate-900">
                    {new Date(selectedApproval.expense_date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 font-medium">Category</p>
                  <p className="text-slate-900">{selectedApproval.category || 'Uncategorized'}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 font-medium">Amount</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedApproval.currency_code} {selectedApproval.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium mb-3">Receipt</p>
                <div className="w-full h-48 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                  <span className="text-slate-500">No receipt available</span>
                </div>
              </div>
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
                onClick={() => handleReject(selectedApproval.approval_id)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                Reject
              </Button>
              <Button
                onClick={() => handleApprove(selectedApproval.approval_id)}
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
