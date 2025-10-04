import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Receipt, LayoutDashboard, CheckSquare, Settings, LogOut, Menu, X, User } from 'lucide-react';
import { Button } from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['employee', 'manager', 'admin'] },
    { id: 'approvals', name: 'Approvals', icon: CheckSquare, roles: ['manager', 'admin'] },
    { id: 'admin', name: 'Admin', icon: Settings, roles: ['admin'] }
  ];

  const visibleNavItems = navigation.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center">
                  <Receipt className="text-white" size={24} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-slate-900">ExpenseFlow</h1>
                  <p className="text-xs text-slate-500">Expense Management</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-1">
                {visibleNavItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentView === item.id
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={18} />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user?.fullName}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="text-indigo-600" size={20} />
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                className="hidden sm:flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {visibleNavItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentView === item.id
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </button>
                );
              })}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{user?.fullName}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
