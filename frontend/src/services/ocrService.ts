import { apiService } from './api';

export interface OCRResult {
  rawText: string;
  potentialAmounts: string[];
  potentialDates: string[];
  potentialVendors: string[];
}

export interface ExpenseLine {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ExtractedExpenseData {
  merchant: string;
  amount: string;
  date: string;
  category: string;
  description: string;
  expenseType: string;
  currency: string;
  taxAmount?: string;
  subtotal?: string;
  expenseLines: ExpenseLine[];
  location?: string;
  rawData?: {
    text: string;
    amount?: number;
    date?: string;
    merchant?: string;
  };
}

/**
 * Extract text and expense data from a receipt image using OCR
 * @param file - The receipt image file (jpg, png, pdf, etc.)
 * @returns Extracted expense data
 */
export async function extractReceiptData(file: File): Promise<ExtractedExpenseData> {
  try {
    const response = await apiService.extractReceiptText(file);
    const ocrData = response.extractedData;

    // Process the OCR data to extract comprehensive information
    const merchant = ocrData.merchant || extractVendorFromText(ocrData.text);
    const amount = ocrData.amount?.toString() || extractAmountFromText(ocrData.text);
    const date = ocrData.date || extractDateFromText(ocrData.text) || new Date().toISOString().split('T')[0];
    const category = categorizeExpense(merchant, ocrData.text);
    const expenseType = determineExpenseType(category, ocrData.text);
    const description = generateDescription(merchant, category);
    const currency = detectCurrency(ocrData.text);
    const expenseLines = extractExpenseLines(ocrData.text);
    const { taxAmount, subtotal } = extractTaxAndSubtotal(ocrData.text, amount);
    const location = extractLocation(ocrData.text);

    return {
      merchant,
      amount,
      date,
      category,
      expenseType,
      description,
      currency,
      taxAmount,
      subtotal,
      expenseLines,
      location,
      rawData: ocrData,
    };
  } catch (error) {
    console.error('OCR extraction failed:', error);
    throw new Error('Failed to extract receipt data. Please try again or enter details manually.');
  }
}

/**
 * Extract vendor name from raw text
 */
function extractVendorFromText(text: string): string {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  return lines.length > 0 ? lines[0].substring(0, 50) : 'Unknown Merchant';
}

/**
 * Extract amount from raw text
 */
function extractAmountFromText(text: string): string {
  // Match currency patterns like $123.45, €50, £25.99, etc.
  const amountPattern = /[$€£¥₹]\s*(\d+[,.]?\d*\.?\d*)/g;
  const matches = text.match(amountPattern);
  
  if (matches && matches.length > 0) {
    // Get the last match (usually the total)
    const lastMatch = matches[matches.length - 1];
    const cleanAmount = lastMatch.replace(/[$€£¥₹,]/g, '');
    const numAmount = parseFloat(cleanAmount);
    return numAmount > 0 ? numAmount.toFixed(2) : '';
  }
  
  return '';
}

/**
 * Extract date from raw text
 */
function extractDateFromText(text: string): string | null {
  // Common date patterns
  const datePatterns = [
    /(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/g, // DD/MM/YYYY or MM/DD/YYYY
    /(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})/g,  // YYYY/MM/DD
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})/gi, // Month DD, YYYY
  ];

  for (const pattern of datePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      try {
        const parsedDate = new Date(matches[0]);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().split('T')[0];
        }
      } catch {
        continue;
      }
    }
  }

  return null;
}

/**
 * Detect currency from receipt text
 */
function detectCurrency(text: string): string {
  const currencySymbols: Record<string, string> = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '¥': 'JPY',
    '₹': 'INR',
    'C$': 'CAD',
    'A$': 'AUD',
    'CHF': 'CHF',
    'CNY': 'CNY',
    'Kr': 'SEK',
  };

  // Check for currency symbols
  for (const [symbol, code] of Object.entries(currencySymbols)) {
    if (text.includes(symbol)) {
      return code;
    }
  }

  // Check for currency codes
  const currencyCodePattern = /\b(USD|EUR|GBP|JPY|INR|CAD|AUD|CHF|CNY|SEK)\b/i;
  const match = text.match(currencyCodePattern);
  if (match) {
    return match[0].toUpperCase();
  }

  // Default to USD if no currency detected
  return 'USD';
}

/**
 * Extract individual expense lines from receipt
 */
function extractExpenseLines(text: string): ExpenseLine[] {
  const lines: ExpenseLine[] = [];
  const textLines = text.split('\n');

  // Pattern to match: Item name followed by price
  const linePattern = /^(.+?)\s+(?:(\d+)\s*x\s*)?[$€£¥₹]?\s*(\d+[.,]\d{2})$/;

  for (const line of textLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(linePattern);
    if (match) {
      const description = match[1].trim();
      const quantity = match[2] ? parseInt(match[2]) : 1;
      const amount = parseFloat(match[3].replace(',', '.'));
      const unitPrice = amount / quantity;

      // Skip if it looks like a total or subtotal line
      if (!/total|subtotal|tax|amount due/i.test(description)) {
        lines.push({
          description,
          quantity,
          unitPrice,
          amount,
        });
      }
    }
  }

  return lines;
}

/**
 * Extract tax amount and subtotal from receipt
 */
function extractTaxAndSubtotal(text: string, totalAmount: string): { taxAmount?: string; subtotal?: string } {
  const total = parseFloat(totalAmount);
  if (isNaN(total)) return {};

  // Look for tax patterns
  const taxPatterns = [
    /tax[:\s]+[$€£¥₹]?\s*(\d+[.,]\d{2})/i,
    /vat[:\s]+[$€£¥₹]?\s*(\d+[.,]\d{2})/i,
    /gst[:\s]+[$€£¥₹]?\s*(\d+[.,]\d{2})/i,
  ];

  let taxAmount: string | undefined;
  for (const pattern of taxPatterns) {
    const match = text.match(pattern);
    if (match) {
      taxAmount = parseFloat(match[1].replace(',', '.')).toFixed(2);
      break;
    }
  }

  // Look for subtotal
  const subtotalPattern = /sub[\s-]?total[:\s]+[$€£¥₹]?\s*(\d+[.,]\d{2})/i;
  const subtotalMatch = text.match(subtotalPattern);
  let subtotal: string | undefined;

  if (subtotalMatch) {
    subtotal = parseFloat(subtotalMatch[1].replace(',', '.')).toFixed(2);
  } else if (taxAmount) {
    // Calculate subtotal from total - tax
    subtotal = (total - parseFloat(taxAmount)).toFixed(2);
  }

  return { taxAmount, subtotal };
}

/**
 * Extract location/address from receipt
 */
function extractLocation(text: string): string | undefined {
  // Look for common address patterns
  const addressPatterns = [
    /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr)[,\s]+[\w\s]+/i,
    /[\w\s]+,\s*[A-Z]{2}\s+\d{5}/i, // City, STATE ZIP
  ];

  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }

  return undefined;
}

/**
 * Determine expense type based on category and content
 */
function determineExpenseType(category: string, text: string): string {
  const lowerText = text.toLowerCase();

  // Business vs Personal indicators
  if (
    /business|meeting|conference|client|customer|company/i.test(lowerText) ||
    category === 'Travel' ||
    category === 'Software'
  ) {
    return 'Business';
  }

  return 'Reimbursable';
}

/**
 * Categorize expense based on merchant name and receipt content
 */
function categorizeExpense(merchant: string, rawText: string): string {
  const lowerMerchant = merchant.toLowerCase();
  const lowerText = rawText.toLowerCase();

  // Food & Beverage
  if (
    /restaurant|cafe|coffee|diner|bistro|grill|pizza|burger|food|starbucks|mcdonald/i.test(lowerMerchant) ||
    /lunch|dinner|breakfast|meal|food|beverage/i.test(lowerText)
  ) {
    return 'Meals';
  }

  // Travel
  if (
    /hotel|motel|inn|airlines|flight|uber|lyft|taxi|rental car|parking|toll/i.test(lowerMerchant) ||
    /hotel|flight|airfare|lodging|accommodation/i.test(lowerText)
  ) {
    return 'Travel';
  }

  // Supplies/Office
  if (
    /office|depot|staples|supplies|amazon|walmart|target/i.test(lowerMerchant) ||
    /office supply|stationery|paper|pen/i.test(lowerText)
  ) {
    return 'Supplies';
  }

  // Software/Technology
  if (
    /microsoft|adobe|apple|google|software|saas|subscription/i.test(lowerMerchant) ||
    /software|subscription|license|cloud/i.test(lowerText)
  ) {
    return 'Software';
  }

  // Marketing
  if (
    /advertising|marketing|media|print|design/i.test(lowerMerchant) ||
    /advertisement|marketing|promotion|campaign/i.test(lowerText)
  ) {
    return 'Marketing';
  }

  // Default
  return 'Other';
}

/**
 * Generate a description based on merchant and category
 */
function generateDescription(merchant: string, category: string): string {
  const categoryDescriptions: Record<string, string> = {
    Meals: 'Meal expense',
    Travel: 'Travel expense',
    Supplies: 'Office supplies',
    Software: 'Software subscription',
    Marketing: 'Marketing expense',
    Other: 'Business expense',
  };

  const baseDescription = categoryDescriptions[category] || 'Business expense';
  return merchant !== 'Unknown Merchant' ? `${baseDescription} at ${merchant}` : baseDescription;
}

/**
 * Validate if a file is a supported image format
 */
export function isValidReceiptFile(file: File): boolean {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/heic',
    'image/heif',
    'application/pdf',
  ];

  const validExtensions = ['.jpg', '.jpeg', '.png', '.heic', '.heif', '.pdf'];

  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

  return hasValidType || hasValidExtension;
}

/**
 * Get a preview URL for the uploaded receipt
 */
export function getReceiptPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export default {
  extractReceiptData,
  isValidReceiptFile,
  getReceiptPreviewUrl,
};
