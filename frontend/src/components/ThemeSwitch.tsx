import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeSwitch() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsDark(d => !d)}
        aria-label="Toggle theme"
        className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors ${isDark ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-600'}`}
      >
        <div className={`w-6 h-6 rounded-full bg-white dark:bg-slate-100 shadow transform transition-transform ${isDark ? 'translate-x-6' : ''}`} />
      </button>
      <div className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
        {isDark ? <Moon size={16} className="text-slate-700 dark:text-slate-300" /> : <Sun size={16} className="text-slate-700 dark:text-slate-300" />}
      </div>
    </div>
  );
}

export default ThemeSwitch;
