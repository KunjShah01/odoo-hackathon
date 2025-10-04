import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Receipt, Sparkles, Zap, Shield, TrendingUp, CheckCircle, ArrowRight, Globe, Clock, Users, BarChart3, FileText, CreditCard, Smartphone, Lock, Star, CheckCircle2, DollarSign, Award, Target, Rocket } from 'lucide-react';

export function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignup) {
        const finalCompanyId = companyId || '11111111-1111-1111-1111-111111111111';
        await signup(email, password, firstName, lastName, finalCompanyId);
      } else {
        await login(email, password);
      }
      // Successfully authenticated - user state will be updated in AuthContext
      console.log('Authentication successful');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Hero Section */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 relative">
          <div className="max-w-xl mx-auto lg:mx-0">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 mb-8 animate-fade-in">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Receipt size={30} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-900 to-teal-700 bg-clip-text text-transparent">
                ExpenseFlow
              </h1>
            </div>

            {/* Hero Title */}
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight animate-slide-in">
              Expense Management
              <span className="block bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h2>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed animate-slide-in">
              Transform how your team handles expenses with AI-powered receipt scanning,
              real-time currency conversion, and intelligent approval workflows.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-in">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="text-teal-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Instant OCR Scanning</h3>
                  <p className="text-sm text-slate-600">Upload receipts and extract data automatically</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-in">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Multi-Currency</h3>
                  <p className="text-sm text-slate-600">Real-time conversion for global teams</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-in">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="text-purple-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Smart Approvals</h3>
                  <p className="text-sm text-slate-600">Customizable workflows for every team</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-in">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-pink-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Real-Time Analytics</h3>
                  <p className="text-sm text-slate-600">Track spending patterns and insights</p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-teal-500" size={18} />
                <span>Trusted by 10,000+ teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-indigo-500" size={18} />
                <span>Save 10+ hours/week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md">
            {/* Glass Card Effect */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20">
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                  <Sparkles className="text-white" size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {isSignup ? 'Create Your Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-600">
                  {isSignup ? 'Join thousands of teams managing expenses smarter' : 'Sign in to access your dashboard'}
                </p>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignup && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="John"
                      />
                      <Input
                        label="Last Name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Doe"
                      />
                    </div>
                    <Input
                      label="Company ID (Optional)"
                      type="text"
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      placeholder="Auto-assigned if empty"
                    />
                  </>
                )}

                <Input
                  label="Email Address"
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

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-shake">
                    <span className="text-red-500">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full group" size="lg">
                  <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              </form>

              {/* Toggle Auth Mode */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                  }}
                  className="text-teal-600 hover:text-teal-700 font-medium transition-colors inline-flex items-center gap-1 group"
                >
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Demo Badge */}
              {!isSignup && (
                <div className="mt-6 text-center">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-50 to-indigo-50 rounded-full">
                    <p className="text-xs text-slate-600">
                      Demo: <span className="font-medium text-slate-900">sarah.admin@techcorp.com</span> / password
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex items-center justify-center gap-8 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Shield size={14} />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={14} />
                <span>GDPR compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
