import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl font-bold text-text mb-2">404</div>
      <p className="text-lg text-text-secondary mb-1">Page not found</p>
      <p className="text-sm text-text-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
          <Home size={16} /> Go Home
        </Link>
        <Link to="/tools" className="inline-flex items-center justify-center gap-2 border border-border px-5 py-2.5 rounded-xl text-sm font-medium text-text hover:bg-surface-alt transition-colors">
          <Search size={16} /> Browse Tools
        </Link>
      </div>
    </div>
  );
}
