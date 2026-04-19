import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PublicNavbar } from '../components/PublicNavbar';

export function AboutPage() {
  const navigate = useNavigate();

  const stats = [
    { value: '5M+', label: 'Expenses Processed' },
    { value: '10K+', label: 'Teams' },
    { value: '50M+', label: 'Saved Hours' },
    { value: '99.9%', label: 'Uptime' },
  ];

  const values = [
    { icon: Award, title: 'Quality First', description: 'We build software that we would use ourselves.' },
    { icon: Users, title: 'Customer Obsessed', description: 'Your success is our success. We listen and iterate.' },
    { icon: TrendingUp, title: 'continuous Growth', description: 'Always improving our OCR, workflows, and features.' },
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

        <div className="grid gap-12 lg:grid-cols-2 items-center mb-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">About</p>
            <h1 className="text-4xl lg:text-6xl font-black mb-6">
              Simplifying{' '}
              <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
                expense management
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              ExpenseFlow was founded with a simple mission: make expense management effortless for teams of all sizes. We combined powerful OCR, smart approvals, and beautiful design into one platform.
            </p>
            <p className="text-lg text-slate-400 mb-8">
              Today, over 10,000 teams trust ExpenseFlow to process millions of expenses annually. We're just getting started.
            </p>
            <Button onClick={() => navigate('/login')} size="lg">
              Get Started <Sparkles size={18} className="ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-amber-200" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-400">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}