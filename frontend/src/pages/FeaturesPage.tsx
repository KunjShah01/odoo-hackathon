import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScanLine, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PublicNavbar } from '../components/PublicNavbar';

export function FeaturesPage() {
  const navigate = useNavigate();

  const features = [
    { icon: ScanLine, title: 'Smart OCR Scanning', description: 'Extract amount, merchant, date, category and tax details from receipts in seconds using AI.' },
    { icon: Workflow, title: 'Approval Workflows', description: 'Configure approval chains based on amount thresholds, departments, or custom rules.' },
    { icon: Globe, title: 'Multi-Currency', description: 'Support for 150+ currencies with automatic conversion to your base currency.' },
    { icon: BarChart3, title: 'Real-Time Analytics', description: 'Track spending patterns with interactive dashboards and exportable reports.' },
    { icon: Users, title: 'Team Management', description: 'Manage users with role-based access: employees, managers, and administrators.' },
    { icon: Shield, title: 'Enterprise Security', description: 'JWT authentication, audit logs, and SOC2-ready compliance features.' },
  ];

  const benefits = [
    'Reduce processing time by 90%',
    'Eliminate manual data entry errors',
    'Standardize approval workflows',
    'Generate compliance-ready reports',
    'Integrate with accounting systems',
    'Mobile-first receipt capture',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <PublicNavbar />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-10 pt-24">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8">
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">Features</p>
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
              manage expenses
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Powerful features designed for modern finance teams.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-cyan-500/30 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={24} className="text-amber-200" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why teams choose ExpenseFlow</h2>
              <div className="space-y-4">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-cyan-400" />
                    <span className="text-slate-200">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <Button onClick={() => navigate('/login')} size="lg">
                Start Free Trial <Sparkles size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}