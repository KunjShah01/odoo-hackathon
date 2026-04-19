import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { 
  Receipt, 
  Sparkles, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  ScanLine,
  Globe,
  Lock,
  Workflow
} from 'lucide-react';

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
      console.log('Authentication successful');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const features = [
    { icon: ScanLine, title: 'Receipt OCR', desc: 'Auto-extract data from receipts' },
    { icon: Globe, title: 'Multi-Currency', desc: 'Real-time global conversion' },
    { icon: Workflow, title: 'Smart Approvals', desc: 'Configurable workflows' },
    { icon: Lock, title: 'Enterprise Security', desc: 'JWT auth & audit logs' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_40%)]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-cyan-500 shadow-lg shadow-cyan-600/30">
                <Receipt size={26} className="text-slate-950" />
              </div>
              <p className="text-3xl font-bold">ExpenseFlow</p>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
              Expense Management
              <span className="block bg-gradient-to-r from-amber-300 via-orange-200 to-cyan-300 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              AI-powered receipt scanning, real-time currency conversion, and intelligent approval workflows for modern teams.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-amber-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                      <p className="text-sm text-slate-400">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-cyan-400" size={18} />
                <span>10K+ teams</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-cyan-400" size={18} />
                <span>Save 10h/week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 lg:p-10 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400 to-cyan-500 rounded-2xl mb-4 shadow-lg">
                  <Sparkles size={26} className="text-slate-950" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isSignup ? 'Create Your Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {isSignup ? 'Join teams managing expenses smarter' : 'Sign in to access your dashboard'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
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

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg">
                  <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-medium text-sm"
                >
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>

              {!isSignup && (
                <div className="mt-4 text-center">
                  <div className="inline-block px-3 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                    <p className="text-xs text-slate-300">
                      Demo: <span className="font-medium text-white">sarah.admin@techcorp.com</span> / password
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
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