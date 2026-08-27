import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import AffiliateBanner from '../ads/AffiliateBanner';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AffiliateBanner />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h4 className="font-semibold text-sm text-text mb-3">Money</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/tools/salary-calculator" className="hover:text-primary transition-colors">Salary Calculator</Link></li>
              <li><Link to="/tools/gcash-fee-calculator" className="hover:text-primary transition-colors">GCash Fees</Link></li>
              <li><Link to="/tools/loan-calculator" className="hover:text-primary transition-colors">Loan Calculator</Link></li>
              <li><Link to="/tools/daily-budget" className="hover:text-primary transition-colors">Daily Budget</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-text mb-3">Shopping</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/tools/discount-calculator" className="hover:text-primary transition-colors">Discount Calculator</Link></li>
              <li><Link to="/tools/unit-price-comparator" className="hover:text-primary transition-colors">Unit Price Comparator</Link></li>
              <li><Link to="/tools/installment-calculator" className="hover:text-primary transition-colors">Installment Calculator</Link></li>
              <li><Link to="/tools/bill-splitter" className="hover:text-primary transition-colors">Bill Splitter</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-text mb-3">Bills & Transport</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/tools/electricity-calculator" className="hover:text-primary transition-colors">Electricity Cost</Link></li>
              <li><Link to="/tools/fuel-calculator" className="hover:text-primary transition-colors">Fuel Calculator</Link></li>
              <li><Link to="/tools/commute-cost" className="hover:text-primary transition-colors">Commute Cost</Link></li>
              <li><Link to="/tools/gwa-calculator" className="hover:text-primary transition-colors">GWA Calculator</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-text mb-3">SulitNow PH</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link></li>
              <li><Link to="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link to="/dmca" className="hover:text-primary transition-colors">DMCA</Link></li>
              <li><Link to="/affiliate-disclosure" className="hover:text-primary transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-bold text-sm">
              <span className="text-primary">Sulit</span>
              <span className="text-accent">Now</span>
              <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1">PH</span>
            </Link>
            <span className="text-xs text-text-muted">© 2026 SulitNow PH. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            Built with <Heart size={12} className="text-red-500 fill-red-500" /> for Filipinos
          </div>
        </div>
      </div>
    </footer>
  );
}
