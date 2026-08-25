import { Briefcase, Info, Star, TrendingUp, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';

const demoPlatforms = [
  {
    name: 'Demo Platform A',
    category: 'Surveys',
    minPayout: '₱250',
    paymentMethods: ['GCash', 'PayPal'],
    trustScore: 7.5,
    reports: { successful: 45, failed: 3 },
    status: 'demo',
  },
  {
    name: 'Demo Platform B',
    category: 'Microtasks',
    minPayout: '₱100',
    paymentMethods: ['GCash', 'Maya'],
    trustScore: 6.2,
    reports: { successful: 28, failed: 8 },
    status: 'demo',
  },
];

export default function Raket() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1 flex items-center gap-2">
          <Briefcase size={24} className="text-primary" />
          RaketCheck PH
        </h1>
        <p className="text-sm text-text-secondary">
          Check earning platforms, side hustles, and online jobs
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
        <div className="text-sm text-yellow-800 dark:text-yellow-300">
          <p className="font-medium mb-1">DEMO DATA</p>
          <p className="text-xs">The data below is for demonstration only. Real platform data will be available when community reports and API sources are connected.</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {demoPlatforms.map((platform) => (
          <Card key={platform.name} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm text-text">{platform.name}</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{platform.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-accent fill-accent" />
                <span className="text-sm font-bold text-text">{platform.trustScore}</span>
                <span className="text-xs text-text-muted">/10</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <span className="text-text-muted">Min Payout:</span>
                <span className="ml-1 font-medium text-text">{platform.minPayout}</span>
              </div>
              <div>
                <span className="text-text-muted">Methods:</span>
                <span className="ml-1 font-medium text-text">{platform.paymentMethods.join(', ')}</span>
              </div>
              <div>
                <span className="text-text-muted">Successful:</span>
                <span className="ml-1 font-medium text-green-600">{platform.reports.successful}</span>
              </div>
              <div>
                <span className="text-text-muted">Failed:</span>
                <span className="ml-1 font-medium text-red-600">{platform.reports.failed}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-text-muted">
              <Info size={10} />
              DEMO DATA — not real reports
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-surface-alt border border-border rounded-xl p-6 text-center">
        <TrendingUp size={32} className="text-text-muted mx-auto mb-3" />
        <h3 className="font-semibold text-sm text-text mb-1">Full RaketCheck Coming Soon</h3>
        <p className="text-xs text-text-muted max-w-md mx-auto">
          Community reports, trust scores, and real platform data will be available when the backend and community features are connected.
        </p>
      </div>
    </div>
  );
}
