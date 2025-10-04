import React from 'react';
import { ExpenseStatus, ApprovalStatus } from '../../types';

interface StatusTagProps {
  status: ExpenseStatus | ApprovalStatus;
}

export function StatusTag({ status }: StatusTagProps) {
  const styles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 border-slate-300',
    pending: 'bg-orange-100 text-orange-700 border-orange-300',
    approved: 'bg-green-100 text-green-700 border-green-300',
    rejected: 'bg-red-100 text-red-700 border-red-300'
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
        styles[status] || styles.draft
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
