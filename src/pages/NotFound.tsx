import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

const popularTools = [
  { name: 'Salary Calculator', path: '/tools/salary-calculator', emoji: '💰' },
  { name: 'GWA Calculator', path: '/tools/gwa-calculator', emoji: '🎓' },
  { name: 'Load Promo Finder', path: '/tools/load-promo-finder', emoji: '📱' },
  { name: 'Fuel Calculator', path: '/tools/fuel-calculator', emoji: '⛽' },
  { name: 'Discount Calculator', path: '/tools/discount-calculator', emoji: '🏷️' },
  { name: 'Bill Splitter', path: '/tools/bill-splitter', emoji: '🍽️' },
];

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist." />
      
      <div className="mb-6">
        <div className="text-8xl font-bold text-primary/10 dark:text-primary/5">404</div>
        <h1 className="text-2xl font-bold text-text -mt-6">Page Not Found</h1>
        <p className="text-sm text-text-secondary mt-2">The page you're looking for doesn't exist or has been moved.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <button onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 border border-border px-5 py-2.5 rounded-xl text-sm font-medium text-text hover:bg-surface-alt transition-colors">
          <ArrowLeft size={16} /> Go Back
        </button>
        <Link to="/" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
          <Home size={16} /> Go Home
        </Link>
        <Link to="/tools" className="inline-flex items-center justify-center gap-2 border border-border px-5 py-2.5 rounded-xl text-sm font-medium text-text hover:bg-surface-alt transition-colors">
          <Search size={16} /> Browse Tools
        </Link>
      </div>

      <div className="bg-surface-alt rounded-xl p-4">
        <h3 className="text-sm font-semibold text-text mb-3">Popular Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          {popularTools.map(tool => (
            <Link key={tool.path} to={tool.path} className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 border border-border rounded-lg hover:border-primary/30 hover:card-shadow transition-all text-left">
              <span className="text-lg">{tool.emoji}</span>
              <span className="text-xs font-medium text-text">{tool.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
