import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Globe, Lock, Receipt, ScanLine, Sparkles, Workflow } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PublicNavbar } from '../components/PublicNavbar';

const highlights = [
  { label: 'Expense reports automated', value: '5M+' },
  { label: 'Average time saved each week', value: '10h' },
  { label: 'Finance teams using platform', value: '10K+' },
];

const capabilities = [
  { icon: ScanLine, title: 'Receipt OCR That Actually Works', description: 'Extract amount, merchant, date, and tax details from real-world receipts in seconds.' },
  { icon: Workflow, title: 'Role-Aware Approval Chains', description: 'Route requests to the right approver instantly with configurable rules and thresholds.' },
  { icon: Globe, title: 'Multi-Currency by Default', description: 'Normalize expenses to base currency for reporting while preserving original transaction data.' },
  { icon: Lock, title: 'Enterprise Security Controls', description: 'JWT auth, auditable actions, strict validation, and hardened API middleware out of the box.' },
];

const workflow = ['Upload or drag receipt image', 'Review auto-extracted expense fields', 'Submit into manager/admin workflow', 'Track status and reimbursement timeline'];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_40%)]" />
      </div>

      <PublicNavbar />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-10 lg:pt-32">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-amber-100">
              <Sparkles size={14} />
              Built For Real Finance Workflows
            </div>
            <h1 className="mt-6 font-display text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Stop Chasing
              <span className="block bg-gradient-to-r from-amber-300 via-orange-200 to-cyan-300 bg-clip-text text-transparent">
                Receipts and Approvals
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              ExpenseFlow combines OCR, approval routing, and reporting into one streamlined system so your team can submit, review, and reimburse expenses without spreadsheet chaos.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button onClick={() => navigate('/login')} size="lg">
                Start Using App <ArrowRight size={18} className="ml-2" />
              </Button>
              <button onClick={() => navigate('/features')} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-300 hover:text-cyan-200">
                Explore Capabilities
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-3xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Live Workflow Preview</p>
              <div className="mt-6 space-y-4">
                {workflow.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-cyan-400 text-xs font-black text-slate-950">
                      {index + 1}
                    </div>
                    <p className="text-sm text-slate-100">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-cyan-300/25 bg-cyan-400/10 p-4">
                <p className="text-xs uppercase tracking-wider text-cyan-200">What Teams Say</p>
                <p className="mt-2 text-sm text-slate-100">
                  "We cut manual processing from two days to two hours and approvals are no longer bottlenecked."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="mt-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Capabilities</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Built to launch and scale</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {capabilities.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <Icon size={22} className="text-amber-200" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-slate-300">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-24 rounded-3xl border border-white/15 bg-slate-900/70 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="font-display text-3xl font-bold text-white">Ready for production launch</h3>
              <ul className="mt-4 space-y-3 text-slate-200">
                <li className="flex items-center gap-2"><Check size={18} className="text-cyan-300" />Environment-driven API endpoints</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-cyan-300" />Hardened CORS configuration on backend</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-cyan-300" />Clean repository ignore rules and env templates</li>
              </ul>
            </div>
            <Button onClick={() => navigate('/login')} size="lg">
              Continue to Sign In <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </section>

        <footer className="mt-24 border-t border-white/10 pt-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Receipt size={20} className="text-slate-950" />
                </div>
                <p className="font-bold text-white">ExpenseFlow</p>
              </div>
              <p className="text-sm text-slate-400">Modern expense management for teams.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Product</p>
              <div className="space-y-2 text-sm text-slate-400">
                <button onClick={() => navigate('/features')} className="block hover:text-cyan-400">Features</button>
                <button onClick={() => navigate('/pricing')} className="block hover:text-cyan-400">Pricing</button>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Company</p>
              <div className="space-y-2 text-sm text-slate-400">
                <button onClick={() => navigate('/about')} className="block hover:text-cyan-400">About</button>
                <button onClick={() => navigate('/contact')} className="block hover:text-cyan-400">Contact</button>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Legal</p>
              <div className="space-y-2 text-sm text-slate-400">
                <button className="block hover:text-cyan-400">Privacy Policy</button>
                <button className="block hover:text-cyan-400">Terms of Service</button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
            © 2024 ExpenseFlow. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}