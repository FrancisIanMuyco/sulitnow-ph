import { useState, useEffect } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import { formatPeso } from '../../../utils/format';
import { Star, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface Promo {
  id: string;
  network: string;
  name: string;
  price: number;
  data: string;
  dataGB: number;
  calls: string;
  texts: string;
  validity: number;
  description: string;
  costPerGB: number;
  scrapedAt?: string;
  source?: string;
}

interface PromoData {
  lastUpdated: string;
  totalPromos: number;
  networks: string[];
  promos: Promo[];
}

const networks = ['All', 'Smart', 'TNT', 'Globe', 'TM', 'DITO'];
type SortBy = 'cost-per-gb' | 'price-asc' | 'data-desc' | 'validity-desc';

export default function LoadPromoFinder() {
  const tool = toolRegistry.find((t) => t.id === 'load-promo-finder')!;
  const [data, setData] = useState<PromoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [network, setNetwork] = useState('All');
  const [maxBudget, setMaxBudget] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('cost-per-gb');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/data/promos.json');
      if (!resp.ok) throw new Error('Failed to load promo data');
      const json = await resp.json();
      setData(json);
    } catch (e) {
      setError('Failed to load promo data. The scraper may need to be run.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const budget = parseFloat(maxBudget) || Infinity;

  let filtered = (data?.promos || [])
    .filter((p) => {
      if (network !== 'All' && p.network !== network) return false;
      if (p.price > budget) return false;
      return true;
    });

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'cost-per-gb': return a.costPerGB - b.costPerGB;
      case 'price-asc': return a.price - b.price;
      case 'data-desc': return b.dataGB - a.dataGB;
      case 'validity-desc': return b.validity - a.validity;
      default: return 0;
    }
  });

  const bestPromo = filtered.length > 0 ? filtered[0] : null;

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  };

  return (
    <ToolLayout
      tool={tool}
      resultText={bestPromo ? `Best value: ${bestPromo.name} (${bestPromo.network}) — ${formatPeso(bestPromo.costPerGB)}/GB` : undefined}
      recommendation={bestPromo ? `Best value: ${bestPromo.name} from ${bestPromo.network} at ${formatPeso(bestPromo.costPerGB)} per GB. ${bestPromo.data} for ${formatPeso(bestPromo.price)} with ${bestPromo.validity}-day validity.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        {/* Status bar */}
        {data && (
          <div className="flex items-center justify-between text-[10px] text-text-muted">
            <div className="flex items-center gap-1">
              <Wifi size={10} className="text-green-500" />
              <span>Live data • {data.totalPromos} promos from {data.networks.length} networks</span>
            </div>
            <span>Last updated: {formatDate(data.lastUpdated)}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
            <WifiOff size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Network filter */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">Network</label>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {networks.map((n) => {
              const count = n === 'All' ? (data?.promos.length || 0) : (data?.promos.filter((p) => p.network === n).length || 0);
              return (
                <button key={n} onClick={() => setNetwork(n)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${network === n ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary hover:bg-border'}`}>
                  {n} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Max Budget (₱)</label>
          <input type="number" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)}
            placeholder="Any budget"
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white dark:bg-slate-800 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Sort by</label>
          <div className="grid grid-cols-2 gap-1.5">
            {([
              { value: 'cost-per-gb' as const, label: 'Best Value (₱/GB)' },
              { value: 'price-asc' as const, label: 'Lowest Price' },
              { value: 'data-desc' as const, label: 'Most Data' },
              { value: 'validity-desc' as const, label: 'Longest Validity' },
            ]).map((s) => (
              <button key={s.value} onClick={() => setSortBy(s.value)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${sortBy === s.value ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary hover:bg-border'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="border-t border-border px-4 py-4">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-surface-alt rounded-xl h-20" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-text">{filtered.length} promos found</h3>
              <button onClick={fetchData} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                <RefreshCw size={10} /> Refresh
              </button>
            </div>

            {filtered.length === 0 && (
              <p className="text-sm text-text-muted text-center py-6">
                {data?.promos.length === 0 ? 'No promos scraped yet. Run the scraper script.' : 'No promos match your filters.'}
              </p>
            )}

            <div className="space-y-2">
              {filtered.slice(0, 30).map((promo, i) => (
                <div key={promo.id} className={`p-3 rounded-xl border ${i === 0 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : 'bg-surface-alt border-border'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {i === 0 && <Star size={10} className="text-green-500 fill-green-500 shrink-0" />}
                        <span className="text-sm font-semibold text-text truncate">{promo.name}</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">{promo.network}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{promo.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">{formatPeso(promo.price)}</p>
                      <p className="text-[10px] text-text-muted">{promo.validity}d</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-text-secondary">
                    <span>📶 {promo.data}</span>
                    {promo.calls !== '—' && <span>📞 {promo.calls}</span>}
                    {promo.texts !== '—' && <span>💬 {promo.texts}</span>}
                    <span className="font-medium text-primary">{formatPeso(promo.costPerGB)}/GB</span>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length > 30 && (
              <p className="text-xs text-text-muted text-center mt-3">Showing 30 of {filtered.length} promos</p>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
