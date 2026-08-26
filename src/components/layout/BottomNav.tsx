import { Link, useLocation } from 'react-router-dom';
import { Home, Wrench, Zap, ShoppingBag, Briefcase } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Tools', path: '/tools', icon: Wrench },
  { label: 'Live', path: '/live', icon: Zap },
  { label: 'Deals', path: '/deals', icon: ShoppingBag },
  { label: 'Raket', path: '/raket', icon: Briefcase },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-border safe-area-bottom" role="navigation" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[48px] ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>{item.label}</span>
              {isActive && <div className="absolute top-0 w-8 h-0.5 bg-primary rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
