import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, Sparkles, UserCircle, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RankBadge from './RankBadge';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleNavigate(to) {
    setMenuOpen(false);
    navigate(to);
  }

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-ink-900 bg-cream-200'
        : 'text-ink-500 hover:text-ink-900 hover:bg-cream-200'
    }`;

  const adminLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-cream-50 bg-ink-900'
        : 'text-brand-700 bg-brand-100 hover:bg-brand-200'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-cream-100/85 backdrop-blur-md border-b border-ink-900/8">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-ink-900 text-cream-50 group-hover:bg-brand-700 transition-colors">
              <Sparkles className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="display text-xl font-medium text-ink-900">CodeQuest</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>
                Головна
              </NavLink>
              <NavLink to="/courses" className={navLinkClass}>
                Курси
              </NavLink>
              <NavLink to="/leaderboard" className={navLinkClass}>
                Рейтинг
              </NavLink>
              <NavLink to="/achievements" className={navLinkClass}>
                Досягнення
              </NavLink>
              {user.role === 'ADMIN' && (
                <NavLink to="/admin" className={adminLinkClass}>
                  <Shield className="w-3.5 h-3.5" />
                  Адмін
                </NavLink>
              )}
            </nav>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-cream-50 border border-ink-900/8">
              <RankBadge rank={user.rank} size="sm" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-medium text-ink-900 tabular-nums">{user.xp}</span>
                <span className="text-xs text-ink-400">XP</span>
              </div>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-cream-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-600 text-cream-50 flex items-center justify-center text-sm font-medium">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium text-ink-700 max-w-[140px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-4 h-4 text-ink-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-cream-50 border border-ink-900/8 shadow-lift overflow-hidden animate-fade-up">
                  <div className="px-4 py-3 border-b border-ink-900/8">
                    <p className="text-sm font-medium text-ink-900 truncate">{user.name}</p>
                    <p className="text-xs text-ink-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleNavigate('/profile')}
                    className="w-full px-4 py-2.5 text-left text-sm text-ink-700 hover:bg-cream-200 flex items-center gap-2"
                  >
                    <UserCircle className="w-4 h-4" />
                    Кабінет
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-ink-700 hover:bg-cream-200 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Вийти
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
