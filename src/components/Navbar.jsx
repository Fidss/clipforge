import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
            <i className="fa-solid fa-scissors text-white text-sm"></i>
          </div>
          <span className="text-xl font-bold text-main tracking-tight group-hover:text-[var(--primary)] transition-colors">ClipForge</span>
        </Link>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:text-main hover:bg-[var(--surface-secondary)] transition-all"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <i className="fa-solid fa-moon"></i>
            ) : (
              <i className="fa-solid fa-sun"></i>
            )}
          </button>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:text-main hover:bg-[var(--surface-secondary)] transition-all"
            title="Log Out"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
