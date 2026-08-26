import { useState, useEffect } from 'react';
import { Briefcase, Info, Star, AlertTriangle, ExternalLink, Shield, ShieldCheck, ShieldAlert, RefreshCw } from 'lucide-react';
import Card from '../../components/ui/Card';

interface Platform {
  name: string;
  category: string;
  url: string;
  minPayout: string;
  paymentMethods: string[];
  description: string;
  trustScore: number;
  riskLevel: string;
  verified: boolean;
  successRate: number;
  reports: { successful: number; failed: number; pending: number };
  notes: string[];
  lastVerified: string;
}

interface RaketData {
  lastUpdated: string;
  platforms: Platform[];
  scamReports: any[];
  stats: {
    totalPlatforms: number;
    verifiedPlatforms: number;
    lowRiskPlatforms: number;
    mediumRiskPlatforms: number;
    totalScamReports: number;
  };
}

const riskColors: Record<string, { bg: string; text: string; icon: typeof Shield }> = {
  low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: ShieldCheck },
  medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Shield },
  high: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: ShieldAlert },
};

const categoryColors: Record<string, string> = {
  Microtasks: 'bg-blue-100 text-blue-700',
  Surveys: 'bg-purple-100 text-purple-700',
  'AI Training': 'bg-indigo-100 text-indigo-700',
  'User Testing': 'bg-pink-100 text-pink-700',
  Transcription: 'bg-teal-100 text-teal-700',
  Freelancing: 'bg-orange-100 text-orange-700',
  'Remote Jobs': 'bg-cyan-100 text-cyan-700',
  Affiliate: 'bg-green-100 text-green-700',
  'Design Sales': 'bg-fuchsia-100 text-fuchsia-700',
  'Live Streaming': 'bg-red-100 text-red-700',
  Trading: 'bg-amber-100 text-amber-700',
};

export default function Raket() {
  const [data, setData] = useState<RaketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/data/raket-reports.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = data ? [...new Set(data.platforms.map(p => p.category))] : [];
  const filtered = data?.platforms.filter(p => filter === 'all' || p.category === filter) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1 flex items-center gap-2">
            <Briefcase size={24} className="text-primary" />
            RaketCheck PH
          </h1>
          <p className="text-sm text-text-secondary">
            Check earning platforms, side hustles, and online jobs
          </p>
        </div>
        {data && (
          <span className="text-[10px] text-text-muted">
            Updated: {new Date(data.lastUpdated).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-primary">{data.stats.totalPlatforms}</p>
            <p className="text-[10px] text-text-muted">Platforms</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-600">{data.stats.verifiedPlatforms}</p>
            <p className="text-[10px] text-text-muted">Verified</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-accent">{data.stats.lowRiskPlatforms}</p>
            <p className="text-[10px] text-text-muted">Low Risk</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-yellow-600">{data.stats.mediumRiskPlatforms}</p>
            <p className="text-[10px] text-text-muted">Medium</p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      {data && (
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary hover:bg-border'
            }`}
          >
            All ({data.platforms.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === cat ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary hover:bg-border'
              }`}
            >
              {cat} ({data.platforms.filter(p => p.category === cat).length})
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <RefreshCw size={24} className="text-text-muted mx-auto mb-2 animate-spin" />
          <p className="text-sm text-text-muted">Loading platform data...</p>
        </div>
      )}

      {/* Platform Cards */}
      <div className="space-y-3">
        {filtered.map((platform) => {
          const risk = riskColors[platform.riskLevel] || riskColors.medium;
          const RiskIcon = risk.icon;
          const catColor = categoryColors[platform.category] || 'bg-gray-100 text-gray-700';

          return (
            <Card key={platform.name} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-text">{platform.name}</h3>
                    {platform.verified && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">VERIFIED</span>
                    )}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${catColor}`}>
                    {platform.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-accent fill-accent" />
                  <span className="text-sm font-bold text-text">{platform.trustScore}</span>
                  <span className="text-xs text-text-muted">/10</span>
                </div>
              </div>

              <p className="text-xs text-text-secondary mb-3">{platform.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-text-muted">Min Payout:</span>
                  <span className="font-medium text-text">{platform.minPayout}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-text-muted">Methods:</span>
                  <span className="font-medium text-text">{platform.paymentMethods.join(', ')}</span>
                </div>
              </div>

              {/* Trust Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-text-muted">Success Rate</span>
                  <span className="font-medium text-text">{platform.successRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      platform.successRate >= 70 ? 'bg-green-500' : platform.successRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${platform.successRate}%` }}
                  />
                </div>
              </div>

              {/* Risk Level */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full ${risk.bg} ${risk.text}`}>
                  <RiskIcon size={10} />
                  {platform.riskLevel.charAt(0).toUpperCase() + platform.riskLevel.slice(1)} Risk
                </div>
                <a href={platform.url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 text-[10px] text-text-muted hover:text-primary transition-colors">
                  Visit <ExternalLink size={10} />
                </a>
              </div>

              {platform.notes.length > 0 && (
                <div className="mt-2 text-[10px] text-text-muted italic">
                  <Info size={10} className="inline mr-1" />
                  {platform.notes[0]}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-12">
          <Briefcase size={32} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-muted">No platforms found for this category.</p>
        </div>
      )}

      {/* Safety Tips */}
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-1.5">
          <AlertTriangle size={14} />
          Safety Tips for Earning Online
        </h3>
        <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
          <li>• Never pay upfront fees to start earning</li>
          <li>• If it sounds too good to be true, it probably is</li>
          <li>• Check reviews before joining any platform</li>
          <li>• Start with small amounts before committing</li>
          <li>• Keep records of all transactions</li>
        </ul>
      </div>
    </div>
  );
}
