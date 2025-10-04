/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, companyId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // If parsing fails, clear corrupted stored data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, _password: string) => {
    try {
      console.log('AuthContext: Starting login...');
      // Mock login - accept any email/password
      const userData: User = {
        id: '1',
        email: email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'employee',
        avatar: '/assets/avatars/avatar1.svg'
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', 'mock-token');
      console.log('AuthContext: Setting user state:', userData);
      setUser(userData);
      console.log('AuthContext: User state set successfully');
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw new Error('Login failed');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signup = async (email: string, _password: string, firstName: string, lastName: string, _companyId: string) => {
    try {
      console.log('AuthContext: Starting signup...');
      // Mock signup
      const userData: User = {
        id: '1',
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: 'employee',
        avatar: '/assets/avatars/avatar2.svg'
      };

    setUser(newUser);
    localStorage.setItem('userId', newUser.id);
    setIsLoading(false);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', 'mock-token');
      console.log('AuthContext: Setting user state:', userData);
      setUser(userData);
      console.log('AuthContext: User state set successfully');
    } catch (error) {
      console.error('AuthContext: Signup error:', error);
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// keep a single component export shape to satisfy fast refresh; this file primarily provides the AuthProvider and hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
