import { useNavigate } from 'react-router-dom';
import { Receipt, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

export function PublicNavbar() {
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-cyan-500 shadow-lg shadow-cyan-600/30">
            <Receipt size={22} className="text-slate-950" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-xl font-bold tracking-tight">ExpenseFlow</p>
            <p className="text-xs text-slate-400">Production Expense Intelligence</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <button key={link.name} onClick={() => navigate(link.path)} className="text-sm text-slate-300 hover:text-white transition-colors">
              {link.name}
            </button>
          ))}
        </div>

        <Button onClick={() => navigate('/login')} size="md">
          Launch Workspace <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </header>
  );
}