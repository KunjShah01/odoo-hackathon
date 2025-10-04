import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Receipt, LayoutDashboard, CheckSquare, Settings, LogOut, Menu, X, User } from 'lucide-react';
import { Button } from './ui/Button';
import { ThemeSwitch } from './ThemeSwitch';
import ProfileModal from './ProfileModal';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['employee', 'manager', 'admin'] },
    { id: 'approvals', name: 'Approvals', icon: CheckSquare, roles: ['manager', 'admin'] },
    { id: 'admin', name: 'Admin', icon: Settings, roles: ['admin'] }
  ];

  const visibleNavItems = navigation.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-500 dark:to-indigo-700 rounded-lg flex items-center justify-center">
                  <Receipt className="text-white" size={24} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">ExpenseFlow</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Expense Management</p>
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
                          ? 'bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700'
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
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user ? `${user.firstName} ${user.lastName}` : ''}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                </div>
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <User className="text-indigo-600 dark:text-indigo-400" size={20} />
                    )}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 py-2">
                      <div className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300">{user?.firstName} {user?.lastName}</div>
                      <div className="border-t border-slate-100 dark:border-slate-700" />
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-200 flex items-center gap-2"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                      >
                        Profile
                      </button>
                      <div className="px-4 py-2">
                        <ThemeSwitch />
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-700" />
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
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
                        ? 'bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </button>
                );
              })}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <User className="text-indigo-600 dark:text-indigo-400" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user ? `${user.firstName} ${user.lastName}` : ''}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
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

  <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
