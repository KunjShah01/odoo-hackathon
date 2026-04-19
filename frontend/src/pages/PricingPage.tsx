import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PublicNavbar } from '../components/PublicNavbar';

export function PricingPage() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for small teams getting started',
      features: ['Up to 5 users', '100 receipts/month', 'Basic OCR', 'Email support'],
      cta: 'Start Free',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For growing teams with advanced needs',
      features: ['Unlimited users', 'Unlimited receipts', 'Priority OCR', 'Multi-currency', 'Analytics dashboard', 'Priority support'],
      cta: 'Start Trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SSO/SAML', 'Audit logs', 'SLA guarantee'],
      cta: 'Contact Sales',
      highlight: false,
    },
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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">Pricing</p>
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            Simple, transparent{' '}
            <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
              pricing
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your team. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 ${
                plan.highlight
                  ? 'border-2 border-cyan-500 bg-slate-800/50'
                  : 'border border-white/10 bg-white/5'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-400">{plan.period}</span>}
              </div>
              <p className="text-sm text-slate-400 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-cyan-400" />
                    <span className="text-slate-200">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlight ? 'primary' : 'secondary'}
                className="w-full"
                onClick={() => navigate('/login')}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Need a custom plan?</h3>
          <p className="text-slate-400 mb-4">Contact us for custom integrations and pricing.</p>
          <Button variant="secondary" onClick={() => navigate('/contact')}>
            Contact Sales
          </Button>
        </div>
      </main>
    </div>
  );
}