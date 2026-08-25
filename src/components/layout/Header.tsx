import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Monitor, Search } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (t: 'light' | 'dark' | 'system') => void;
  onSearchOpen: () => void;
}

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Tools', path: '/tools' },
  { label: 'Live', path: '/live' },
  { label: 'Deals', path: '/deals' },
  { label: 'Raket', path: '/raket' },
  { label: 'Pricing', path: '/pricing' },
];

const themeIcons = {
  light: <Sun size={16} />,
  dark: <Moon size={16} />,
  system: <Monitor size={16} />,
};

export default function Header({ theme, onThemeChange, onSearchOpen }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">Sulit</span>
          <span className="text-accent">Now</span>
          <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">PH</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text hover:bg-surface-alt'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchOpen}
            className="p-2 rounded-lg hover:bg-surface-alt transition-colors text-text-secondary"
            aria-label="Search tools"
          >
            <Search size={18} />
          </button>

          {/* Theme toggle */}
          <div className="hidden md:flex items-center bg-surface-alt rounded-lg p-0.5">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`p-1.5 rounded-md transition-colors ${
                  theme === t
                    ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
                aria-label={`${t} mode`}
              >
                {themeIcons[t]}
              </button>
            ))}
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-alt transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-white dark:bg-slate-900 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-surface-alt'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-xs text-text-muted px-3">Theme:</span>
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === t
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-surface-alt'
                }`}
                aria-label={`${t} mode`}
              >
                {themeIcons[t]}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
