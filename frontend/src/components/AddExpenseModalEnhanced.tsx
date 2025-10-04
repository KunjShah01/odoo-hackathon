import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input, Select, TextArea } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useExpenseStore } from '../store/useExpenseStore';
import { Upload, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { extractReceiptData, isValidReceiptFile, getReceiptPreviewUrl, type ExpenseLine } from '../services/ocrService';
import { convertCurrency } from '../services/currencyService';

interface AddExpenseModalEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseModalEnhanced({ isOpen, onClose }: AddExpenseModalEnhancedProps) {
  const { user } = useAuth();
  const { createExpense, submitExpenseForApproval } = useExpenseStore();
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [showExpenseLines, setShowExpenseLines] = useState(false);
  const [expenseLines, setExpenseLines] = useState<ExpenseLine[]>([]);
  const [detectedCurrency, setDetectedCurrency] = useState<string>('USD');
  const [conversionInfo, setConversionInfo] = useState<{ rate: number; date: string } | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Meals',
    expenseType: 'Business',
    merchant: '',
    amount: '',
    currency: 'USD',
    taxAmount: '',
    subtotal: '',
    location: '',
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

      // Handle currency conversion if needed
      if (extractedData.currency !== 'USD' && extractedData.amount) {
        try {
          const conversion = await convertCurrency(
            parseFloat(extractedData.amount),
            extractedData.currency,
            'USD'
          );
          setConversionInfo({
            rate: conversion.rate,
            date: conversion.date
          });
        } catch (convErr) {
          console.warn('Currency conversion failed:', convErr);
        }
      }

      setDetectedCurrency(extractedData.currency);
      setExpenseLines(extractedData.expenseLines || []);
      
      // Update form with extracted data
      setFormData(prev => ({
        ...prev,
        merchant: extractedData.merchant || prev.merchant,
        amount: extractedData.amount || prev.amount,
        date: extractedData.date || prev.date,
        category: extractedData.category || prev.category,
        expenseType: extractedData.expenseType || prev.expenseType,
        description: extractedData.description || prev.description,
        currency: extractedData.currency || prev.currency,
        taxAmount: extractedData.taxAmount || '',
        subtotal: extractedData.subtotal || '',
        location: extractedData.location || '',
        receiptUrl: getReceiptPreviewUrl(file)
      }));

      // Show success message or extracted fields count
      if (extractedData.expenseLines && extractedData.expenseLines.length > 0) {
        setShowExpenseLines(true);
      }
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

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'Meals',
        expenseType: 'Business',
        merchant: '',
        amount: '',
        currency: 'USD',
        taxAmount: '',
        subtotal: '',
        location: '',
        notes: '',
        receiptUrl: ''
      });
      setExpenseLines([]);
      setConversionInfo(null);

      onClose();
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense" size="xl">
      <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
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

        {/* OCR Success Info */}
        {detectedCurrency !== 'USD' && conversionInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Currency Detected: {detectedCurrency}</p>
                <p className="text-sm text-blue-700 mt-1">
                  Conversion rate: 1 {detectedCurrency} = {conversionInfo.rate} USD (as of {conversionInfo.date})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="receipt-upload-enhanced"
          />
          <label htmlFor="receipt-upload-enhanced" className="cursor-pointer">
            {isOCRProcessing ? (
              <div className="flex flex-col items-center">
                <Sparkles className="text-teal-500 animate-pulse" size={48} />
                <p className="mt-4 text-slate-900 font-medium">Processing receipt with AI OCR...</p>
                <p className="text-sm text-slate-500">Extracting merchant, amount, date, items, and more...</p>
              </div>
            ) : formData.receiptUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={formData.receiptUrl}
                  alt="Receipt"
                  className="max-h-32 rounded-lg mb-2"
                />
                <p className="text-sm text-teal-600 font-medium">✓ Receipt uploaded & processed</p>
                {expenseLines.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    {expenseLines.length} line item{expenseLines.length !== 1 ? 's' : ''} detected
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="text-slate-400" size={48} />
                <p className="mt-4 text-slate-900 font-medium">Upload Receipt</p>
                <p className="text-sm text-slate-500">
                  Drag & drop or click to upload. AI OCR will auto-extract all details.
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Supports JPG, PNG, PDF, HEIC • Max 10MB
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="text-teal-500" size={20} />
            Expense Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <Select
              label="Expense Type"
              value={formData.expenseType}
              onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
              required
            >
              <option value="Business">Business</option>
              <option value="Reimbursable">Reimbursable</option>
              <option value="Personal">Personal</option>
            </Select>
          </div>

          <Input
            label="Merchant / Vendor"
            type="text"
            value={formData.merchant}
            onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
            placeholder="e.g., Starbucks, Hilton Hotel"
            required
          />

          <Input
            label="Description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Client dinner meeting, Conference registration"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="Meals">Meals & Entertainment</option>
              <option value="Travel">Travel & Lodging</option>
              <option value="Supplies">Office Supplies</option>
              <option value="Software">Software & Subscriptions</option>
              <option value="Marketing">Marketing & Advertising</option>
              <option value="Other">Other</option>
            </Select>

            <Input
              label="Location (Optional)"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., New York, NY"
            />
          </div>
        </div>

        {/* Amount Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Amount Breakdown</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Subtotal (Optional)"
              type="number"
              step="0.01"
              value={formData.subtotal}
              onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
              placeholder="0.00"
            />

            <Input
              label="Tax Amount (Optional)"
              type="number"
              step="0.01"
              value={formData.taxAmount}
              onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Total Amount"
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
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CHF">CHF - Swiss Franc</option>
            </Select>
          </div>
        </div>

        {/* Expense Lines (if detected) */}
        {expenseLines.length > 0 && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowExpenseLines(!showExpenseLines)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                Line Items ({expenseLines.length})
              </h3>
              <span className="text-teal-600 text-sm font-medium">
                {showExpenseLines ? 'Hide' : 'Show'}
              </span>
            </button>

            {showExpenseLines && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-600 border-b border-slate-300 pb-2">
                  <div className="col-span-6">Item</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                {expenseLines.map((line, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 text-sm text-slate-700">
                    <div className="col-span-6">{line.description}</div>
                    <div className="col-span-2 text-right">{line.quantity}</div>
                    <div className="col-span-2 text-right">${line.unitPrice.toFixed(2)}</div>
                    <div className="col-span-2 text-right font-medium">${line.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <TextArea
          label="Additional Notes (Optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional details about this expense..."
          rows={3}
        />

        {/* Action Buttons */}
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
