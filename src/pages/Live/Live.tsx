import { useState, useEffect, useCallback } from 'react';
import { Wifi, RefreshCw, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';

interface ServiceStatus {
  id: string;
  name: string;
  category: string;
  url: string;
  status: 'operational' | 'issues' | 'major';
  responseTime: number | null;
  statusCode: number | null;
}

interface StatusData {
  lastUpdated: string;
  services: ServiceStatus[];
}

interface SourceHealth {
  domain: string;
  purpose: string;
  reachable: boolean;
  status: number | null;
  waf: string | null;
  blocked: boolean;
  strategy: string;
}

interface SecurityReport {
  lastUpdated: string;
  verdict: string;
  sources: SourceHealth[];
  blockedSources: string[];
}

const strategyConfig: { [key: string]: { label: string; color: string; bg: string } } = {
  SCRAPE: { label: 'Direct', color: 'text-green-600 dark:text-green-400', bg: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' },
  ROTATE_UA: { label: 'Rotate UA', color: 'text-yellow-600 dark:text-yellow-400', bg: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' },
  NEED_PROXY: { label: 'Use Proxy', color: 'text-orange-600 dark:text-orange-400', bg: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20' },
  SKIP: { label: 'Down', color: 'text-red-600 dark:text-red-400', bg: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' },
};

const statusConfig: { [key: string]: { icon: string; label: string; color: string; bg: string } } = {
  operational: { icon: '🟢', label: 'Operational', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
  issues: { icon: '🟡', label: 'Possible Issues', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
  major: { icon: '🔴', label: 'Major Issues', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
};

const categoryOrder = ['Network', 'E-Wallet', 'Bank', 'Telecom', 'Shopping', 'Services'];
const categoryEmoji: { [key: string]: string } = {
  'Network': '📱', 'E-Wallet': '💰', 'Bank': '🏦', 'Telecom': '🌐', 'Shopping': '🛒', 'Services': '🚗',
};

export default function Live() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(300);
  const [srcHealth, setSrcHealth] = useState<SecurityReport | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/data/service-status.json');
      if (!res.ok) throw new Error('Failed to load');
      const d: StatusData = await res.json();
      setData(d);
      setLastUpdated(new Date(d.lastUpdated));
      setCountdown(300);
      setLoading(false);
      setError('');
    } catch {
      setError('Unable to load service status data');
      setLoading(false);
    }
  }, []);

  const fetchSourceHealth = useCallback(async () => {
    try {
      const res = await fetch('/data/security-report.json');
      if (!res.ok) throw new Error('n/a');
      setSrcHealth(await res.json());
    } catch {
      setSrcHealth(null);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchSourceHealth();
  }, [fetchStatus, fetchSourceHealth]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { fetchStatus(); return 300; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchStatus]);

  const operational = data?.services.filter(s => s.status === 'operational').length || 0;
  const issues = data?.services.filter(s => s.status === 'issues').length || 0;
  const major = data?.services.filter(s => s.status === 'major').length || 0;
  const categories = data ? categoryOrder.filter(cat => data.services.some(s => s.category === cat)) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <SEOHead
        title="LIVE PH — Service Status"
        description="Real-time status check for GCash, Maya, Smart, Globe, Shopee, BPI, and popular Philippine services."
        keywords="service status, gcash status, maya status, smart status, globe status, PH service down"
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1 flex items-center gap-2">
          <Wifi size={24} className="text-primary" />
          LIVE PH
        </h1>
        <p className="text-sm text-text-secondary">
          Real-time status of networks, e-wallets, banks, and popular services
        </p>
      </div>

      {/* Live Status Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-border mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${data ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-pulse'}`} />
          <span className="text-xs font-medium text-text-secondary">
            {data ? 'LIVE' : 'Loading...'}
          </span>
          {lastUpdated && (
            <span className="text-xs text-text-muted">
              · Updated {lastUpdated.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            Next: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </span>
          <button onClick={fetchStatus}
            className="p-1.5 rounded-lg hover:bg-surface-alt transition-colors"
            title="Refresh now">
            <RefreshCw size={14} className={`text-text-muted ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-surface-alt rounded w-24 mb-3" />
              <div className="grid grid-cols-2 gap-3">
                {[1,2].map(j => <div key={j} className="h-24 bg-surface-alt rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button onClick={fetchStatus}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      ) : data && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{operational}</p>
              <p className="text-xs text-green-600 dark:text-green-400">Operational</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-yellow-600">{issues}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Issues</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{major}</p>
              <p className="text-xs text-red-600 dark:text-red-400">Major</p>
            </div>
          </div>

          {/* Services by Category */}
          {categories.map(cat => (
            <div key={cat} className="mb-6">
              <h2 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                <span>{categoryEmoji[cat]}</span> {cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.services.filter(s => s.category === cat).map(service => {
                  const config = statusConfig[service.status];
                  return (
                    <div key={service.id} className={`border rounded-xl p-4 ${config.bg}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-text">{service.name}</span>
                          {service.url && (
                            <a href={service.url} target="_blank" rel="noopener noreferrer"
                              className="text-text-muted hover:text-primary transition-colors">
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        <span className="text-sm">{config.icon}</span>
                      </div>
                      <p className={`text-xs mt-1 font-medium ${config.color}`}>{config.label}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted">
                        {service.responseTime != null && (
                          <span>⚡ {service.responseTime}ms</span>
                        )}
                        {service.statusCode != null && (
                          <span>HTTP {service.statusCode}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Data Source */}
          <div className="text-center text-xs text-text-muted space-y-1 mt-4">
            <p>📡 Health checks performed server-side · Auto-refreshes every 5 minutes</p>
            <p>Status based on HTTP response time and availability</p>
          </div>
        </>
      )}

      {/* Scrape-Source Health */}
      {srcHealth && (
        <div className="mt-8 bg-white dark:bg-slate-800 border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <div>
                <h3 className="text-sm font-semibold text-text">Data Source Health</h3>
                <p className="text-[10px] text-text-muted">
                  Security & reliability audit of every scrape source (nuclei/WAF probe)
                </p>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
              srcHealth.verdict === 'PASS'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {srcHealth.verdict}
            </span>
          </div>
          <div className="divide-y divide-border">
            {srcHealth.sources.slice(0, 20).map((s, i) => {
              const cfg = strategyConfig[s.strategy] || strategyConfig.SKIP;
              return (
                <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text truncate">{s.domain}</p>
                    {s.purpose && (
                      <p className="text-[10px] text-text-muted truncate">{s.purpose}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.waf && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface-alt text-text-muted">
                        {s.waf}
                      </span>
                    )}
                    {s.status != null && (
                      <span className="text-[9px] text-text-muted">HTTP {s.status}</span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
            {srcHealth.sources.length > 20 && (
              <p className="px-4 py-2 text-[10px] text-text-muted text-center">
                + {srcHealth.sources.length - 20} more sources
              </p>
            )}
          </div>
          <div className="px-4 py-2 bg-surface-alt/50 border-t border-border text-[10px] text-text-muted">
            Generated at {srcHealth.lastUpdated ? new Date(srcHealth.lastUpdated).toLocaleString('en-PH') : 'n/a'}
            {' '}· Click 💡 to view how a source should be scraped (Direct / Rotate UA / Use Proxy / Down)
          </div>
        </div>
      )}

      {/* Community Reports */}
      <div className="mt-8 bg-surface-alt border border-border rounded-xl p-6 text-center">
        <AlertCircle size={32} className="text-text-muted mx-auto mb-3" />
        <h3 className="font-semibold text-sm text-text mb-1">Community Reports</h3>
        <p className="text-xs text-text-muted max-w-md mx-auto">
          Report outages and issues to help the community. Community reporting will be available when the backend is connected.
        </p>
        <p className="text-xs text-primary mt-3 font-medium">Coming Soon</p>
      </div>
    </div>
  );
}
