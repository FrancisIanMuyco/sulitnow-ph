import { useRef, useEffect, useState } from 'react';
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
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const idx = navItems.findIndex(item => item.path === location.pathname);
    if (idx === -1 || !itemRefs.current[idx] || !navRef.current) return;

    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = itemRefs.current[idx].getBoundingClientRect();

    setIndicator({
      left: itemRect.left - navRect.left + (itemRect.width - 32) / 2,
      width: 32,
    });
  }, [location.pathname]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-border safe-area-bottom" role="navigation" aria-label="Mobile navigation">
      <div ref={navRef} className="relative flex items-center justify-around h-14">
        {/* Animated indicator */}
        <div
          className="nav-indicator absolute top-0 h-0.5 bg-primary rounded-full"
          style={{ left: indicator.left, width: indicator.width }}
        />

        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[48px] relative"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                ref={el => { itemRefs.current[idx] = el; }}
                className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${
                  isActive ? 'text-primary scale-110' : 'text-text-muted'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-primary' : ''}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
