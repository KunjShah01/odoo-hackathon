import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Receipt, LayoutDashboard, CheckSquare, Settings, LogOut, Menu, X, User, BarChart3, FileText, Tags, Users, Bell, HelpCircle, Building } from 'lucide-react';
import { Button } from './ui/Button';
import { ThemeSwitch } from './ThemeSwitch';
import ProfileModal from './ProfileModal';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
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
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['employee', 'manager', 'admin'] },
    { path: '/expenses', name: 'My Expenses', icon: Receipt, roles: ['employee', 'manager', 'admin'] },
    { path: '/approvals', name: 'Approvals', icon: CheckSquare, roles: ['manager', 'admin'] },
    { path: '/reports', name: 'Reports', icon: BarChart3, roles: ['employee', 'manager', 'admin'] },
    { path: '/analytics', name: 'Analytics', icon: Building, roles: ['manager', 'admin'] },
    { path: '/categories', name: 'Categories', icon: Tags, roles: ['admin'] },
    { path: '/users', name: 'Team', icon: Users, roles: ['admin'] },
    { path: '/notifications', name: 'Notifications', icon: Bell, roles: ['employee', 'manager', 'admin'] },
    { path: '/help', name: 'Help', icon: HelpCircle, roles: ['employee', 'manager', 'admin'] },
    { path: '/settings', name: 'Settings', icon: Settings, roles: ['employee', 'manager', 'admin'] },
    { path: '/admin', name: 'Admin', icon: Settings, roles: ['admin'] },
  ];

  const visibleNavItems = navigation.filter(item =>
    user && item.roles.includes(user.role)
  );

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Receipt className="text-slate-950" size={24} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-white">ExpenseFlow</h1>
                  <p className="text-xs text-slate-400">Expense Management</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-1">
                {visibleNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
                  <p className="text-sm font-medium text-white">{user ? `${user.firstName} ${user.lastName}` : ''}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <User className="text-slate-300" size={20} />
                    )}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 py-2">
                      <div className="px-4 py-2 text-sm text-slate-200">{user?.firstName} {user?.lastName}</div>
                      <div className="border-t border-slate-700" />
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                      >
                        <User size={16} />
                        Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/reports');
                        }}
                      >
                        <FileText size={16} />
                        Reports
                      </button>
                      <div className="px-4 py-2">
                        <ThemeSwitch />
                      </div>
                      <div className="border-t border-slate-700" />
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          navigate('/login');
                        }}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>

              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-900">
            <div className="px-4 py-4 space-y-2">
              {visibleNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </button>
                );
              })}
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <User className="text-slate-300" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user ? `${user.firstName} ${user.lastName}` : ''}</p>
                    <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
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

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}