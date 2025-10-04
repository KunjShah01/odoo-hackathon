import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, role: string, country: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'employee@company.com',
    fullName: 'John Employee',
    role: 'employee',
    country: 'US',
    defaultCurrency: 'USD'
  },
  {
    id: '2',
    email: 'manager@company.com',
    fullName: 'Sarah Manager',
    role: 'manager',
    country: 'US',
    defaultCurrency: 'USD'
  },
  {
    id: '3',
    email: 'admin@company.com',
    fullName: 'Alex Admin',
    role: 'admin',
    country: 'US',
    defaultCurrency: 'USD'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      const foundUser = MOCK_USERS.find(u => u.id === storedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = MOCK_USERS.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('userId', foundUser.id);
    } else {
      throw new Error('Invalid credentials');
    }

    setIsLoading(false);
  };

  const signup = async (email: string, password: string, fullName: string, role: string, country: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const currencyMap: Record<string, string> = {
      'US': 'USD', 'GB': 'GBP', 'EU': 'EUR', 'JP': 'JPY', 'IN': 'INR', 'CA': 'CAD'
    };

    const newUser: User = {
      id: Date.now().toString(),
      email,
      fullName,
      role: role as any,
      country,
      defaultCurrency: currencyMap[country] || 'USD'
    };

    setUser(newUser);
    localStorage.setItem('userId', newUser.id);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
