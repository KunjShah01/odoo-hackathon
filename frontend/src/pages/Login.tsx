import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Receipt } from 'lucide-react';

export function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('employee');
  const [country, setCountry] = useState('US');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignup) {
        await signup(email, password, fullName, role, country);
      } else {
        await login(email, password, role);
      }
    } catch (err) {
      setError('Invalid credentials. Try: employee@company.com, manager@company.com, or admin@company.com');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 to-indigo-700 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
              <Receipt size={28} />
            </div>
            <h1 className="text-3xl font-bold">ExpenseFlow</h1>
          </div>
          <h2 className="text-4xl font-bold mb-4">Modern Expense Management</h2>
          <p className="text-lg text-indigo-200 mb-6">
            Streamline your expense tracking with OCR-powered receipt scanning,
            automated currency detection, and intelligent approval workflows.
          </p>
          <div className="space-y-3 text-indigo-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full" />
              <span>Instant OCR receipt scanning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full" />
              <span>Multi-currency support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full" />
              <span>Customizable approval flows</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-600">
              {isSignup ? 'Start managing expenses today' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Doe"
              />
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </Select>

            {isSignup && (
              <Select
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="US">🇺🇸 United States (USD)</option>
                <option value="GB">🇬🇧 United Kingdom (GBP)</option>
                <option value="EU">🇪🇺 European Union (EUR)</option>
                <option value="JP">🇯🇵 Japan (JPY)</option>
                <option value="IN">🇮🇳 India (INR)</option>
                <option value="CA">🇨🇦 Canada (CAD)</option>
              </Select>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {!isSignup && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">Demo Accounts:</p>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Employee: employee@company.com</div>
                <div>Manager: manager@company.com</div>
                <div>Admin: admin@company.com</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
