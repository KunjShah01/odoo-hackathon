const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

interface SignupResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

interface ExpenseResponse {
  expense: {
    id: string;
    user_id: string;
    description: string;
    amount: number;
    currency_code: string;
    category: string;
    expense_date: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

interface ExpensesListResponse {
  expenses: Array<{
    id: string;
    user_id: string;
    description: string;
    amount: number;
    currency_code: string;
    category: string;
    expense_date: string;
    status: string;
    created_at: string;
    updated_at: string;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalExpenses: number;
    hasMore: boolean;
  };
}

interface ApprovalResponse {
  approval_id: string;
  expense_id: string;
  approver_id: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  first_name: string;
  last_name: string;
  description?: string;
  amount: number;
  currency_code: string;
  category?: string;
  expense_date: string;
}

interface ApprovalsListResponse {
  approvals: ApprovalResponse[];
}

interface ApprovalActionResponse {
  message: string;
  approval: {
    id: string;
    expense_id: string;
    approver_id: string;
    status: string;
    comments?: string;
    reviewed_at: string;
  };
  expense: {
    id: string;
    status: string;
  };
}

interface CurrencyRatesResponse {
  base: string;
  rates: Record<string, number>;
  timestamp: string;
}

interface CurrencyConvertResponse {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
}

interface OCRResponse {
  message: string;
  extractedData: {
    text: string;
    amount?: number;
    date?: string;
    merchant?: string;
  };
}

interface DeleteResponse {
  message: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || 'Request failed');
    }
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<LoginResponse>(response);
  }

  async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyId: string;
  }): Promise<SignupResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse<SignupResponse>(response);
  }

  // Expense endpoints
  async getExpenses(page = 1, limit = 10, status?: string): Promise<ExpensesListResponse> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);

    const response = await fetch(`${API_BASE_URL}/expenses?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ExpensesListResponse>(response);
  }

  async getExpense(id: string): Promise<ExpenseResponse> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ExpenseResponse>(response);
  }

  async createExpense(data: {
    description: string;
    amount: number;
    currencyCode: string;
    category: string;
    expenseDate: string;
  }): Promise<ExpenseResponse> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<ExpenseResponse>(response);
  }

  async updateExpense(id: string, data: Partial<{
    description: string;
    amount: number;
    currencyCode: string;
    category: string;
    expenseDate: string;
  }>): Promise<ExpenseResponse> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<ExpenseResponse>(response);
  }

  async deleteExpense(id: string): Promise<DeleteResponse> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<DeleteResponse>(response);
  }

  async submitExpenseForApproval(id: string): Promise<ExpenseResponse> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}/submit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ExpenseResponse>(response);
  }

  // Approval endpoints
  async getPendingApprovals(): Promise<ApprovalsListResponse> {
    const response = await fetch(`${API_BASE_URL}/approvals/pending`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ApprovalsListResponse>(response);
  }

  async approveExpense(approvalId: string, comments?: string): Promise<ApprovalActionResponse> {
    const response = await fetch(`${API_BASE_URL}/approvals/${approvalId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ comments }),
    });
    return this.handleResponse<ApprovalActionResponse>(response);
  }

  async rejectExpense(approvalId: string, comments: string): Promise<ApprovalActionResponse> {
    const response = await fetch(`${API_BASE_URL}/approvals/${approvalId}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ comments }),
    });
    return this.handleResponse<ApprovalActionResponse>(response);
  }

  // Currency endpoints
  async getCurrencyRates(): Promise<CurrencyRatesResponse> {
    const response = await fetch(`${API_BASE_URL}/currency/rates`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<CurrencyRatesResponse>(response);
  }

  async convertCurrency(from: string, to: string, amount: number): Promise<CurrencyConvertResponse> {
    const response = await fetch(`${API_BASE_URL}/currency/convert`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ from, to, amount }),
    });
    return this.handleResponse<CurrencyConvertResponse>(response);
  }

  // OCR endpoints
  async extractReceiptText(file: File): Promise<OCRResponse> {
    const formData = new FormData();
    formData.append('receipt', file);

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/ocr/extract`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    return this.handleResponse<OCRResponse>(response);
  }
}

export const apiService = new ApiService();
export { ApiError };