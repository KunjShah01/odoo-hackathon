import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input, Select, TextArea } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useExpenseStore } from '../store/useExpenseStore';
import { Upload, Sparkles, AlertCircle } from 'lucide-react';
import { extractReceiptData, isValidReceiptFile, getReceiptPreviewUrl } from '../services/ocrService';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const { user } = useAuth();
  const { createExpense, submitExpenseForApproval } = useExpenseStore();
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Meals',
    merchant: '',
    amount: '',
    currency: 'USD',
    notes: '',
    receiptUrl: ''
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isValidReceiptFile(file)) {
      setOcrError('Invalid file type. Please upload a JPG, PNG, PDF, or HEIC file.');
      return;
    }

    setIsOCRProcessing(true);
    setOcrError(null);

    try {
      // Extract data using OCR
      const extractedData = await extractReceiptData(file);

      // Update form with extracted data
      setFormData(prev => ({
        ...prev,
        merchant: extractedData.merchant || prev.merchant,
        amount: extractedData.amount || prev.amount,
        date: extractedData.date || prev.date,
        category: extractedData.category || prev.category,
        description: extractedData.description || prev.description,
        receiptUrl: getReceiptPreviewUrl(file)
      }));
    } catch (error) {
      console.error('OCR processing error:', error);
      setOcrError('Failed to extract receipt data. You can still enter details manually.');
      // Still set the receipt preview even if OCR fails
      setFormData(prev => ({
        ...prev,
        receiptUrl: getReceiptPreviewUrl(file)
      }));
    } finally {
      setIsOCRProcessing(false);
    }
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!user) return;

    try {
      const expense = await createExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
        currencyCode: formData.currency,
        category: formData.category,
        expenseDate: formData.date
      });

      if (!isDraft) {
        await submitExpenseForApproval(expense.id);
      }

      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'Meals',
        merchant: '',
        amount: '',
        currency: 'USD',
        notes: '',
        receiptUrl: ''
      });

      onClose();
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense" size="lg">
      <div className="p-6 space-y-6">
        {/* OCR Error Message */}
        {ocrError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-red-900">OCR Processing Error</p>
              <p className="text-sm text-red-700 mt-1">{ocrError}</p>
            </div>
          </div>
        )}

        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="receipt-upload"
          />
          <label htmlFor="receipt-upload" className="cursor-pointer">
            {isOCRProcessing ? (
              <div className="flex flex-col items-center">
                <Sparkles className="text-teal-500 animate-pulse" size={48} />
                <p className="mt-4 text-slate-900 font-medium">Processing receipt with OCR...</p>
                <p className="text-sm text-slate-500">Extracting data automatically</p>
              </div>
            ) : formData.receiptUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={formData.receiptUrl}
                  alt="Receipt"
                  className="max-h-32 rounded-lg mb-2"
                />
                <p className="text-sm text-teal-600 font-medium">Receipt uploaded</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="text-slate-400" size={48} />
                <p className="mt-4 text-slate-900 font-medium">Upload Receipt</p>
                <p className="text-sm text-slate-500">
                  Drag & drop or click to upload. OCR will auto-fill details.
                </p>
              </div>
            )}
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="Meals">Meals</option>
            <option value="Travel">Travel</option>
            <option value="Supplies">Supplies</option>
            <option value="Software">Software</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <Input
          label="Description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g., Client dinner meeting"
          required
        />

        <Input
          label="Merchant"
          type="text"
          value={formData.merchant}
          onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
          placeholder="e.g., The Steakhouse"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />

          <Select
            label="Currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            required
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </Select>
        </div>

        <TextArea
          label="Notes (Optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional details..."
          rows={3}
        />

        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSubmit(true)}
            className="flex-1"
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            className="flex-1"
          >
            Submit for Approval
          </Button>
        </div>
      </div>
    </Modal>
  );
}
