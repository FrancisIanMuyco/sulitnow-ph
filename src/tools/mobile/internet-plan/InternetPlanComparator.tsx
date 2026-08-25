import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { Globe } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'internet-plan-comparator')!;

interface InternetPlan {
  provider: string;
  plan: string;
  price: number;
  speed: number;
  speedUnit: string;
  data: string;
  lockIn: number;
  validity?: number;
  type: string;
  promo?: string;
}

interface InternetData {
  lastUpdated: string;
  source: string;
  plans: InternetPlan[];
}

export default function InternetPlanComparator() {
  const [data, setData] = useState<InternetData | null>(null);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'postpaid' | 'prepaid'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'speed' | 'value'>('value');

  useEffect(() => {
    fetch('/data/internet-plans.json').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const plans = data?.plans || [];
  const filtered = plans.filter(p =>
    (filter === 'all' || p.provider === filter) &&
    (typeFilter === 'all' || p.type === typeFilter)
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'speed') return b.speed - a.speed;
    const valA = a.price > 0 ? a.speed / a.price : 999;
    const valB = b.price > 0 ? b.speed / b.price : 999;
    return valB - valA;
  });

  const providers = ['all', ...Array.from(new Set(plans.map(p => p.provider)))];
  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH');

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Internet Plan Comparator</h3>
            {data && <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">LIVE</span>}
          </div>
          <p className="text-[10px] text-text-muted mb-3">Source: {data?.source || 'Loading...'} | {plans.length} plans from {providers.length - 1} providers</p>

          {/* Provider filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
            {providers.map(p => (
              <button key={p} onClick={() => setFilter(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${filter === p ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border hover:border-primary'}`}>
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex gap-2 mt-2">
            {(['all', 'postpaid', 'prepaid'] as const).map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition border ${typeFilter === t ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface text-text-muted border-border'}`}>
                {t === 'all' ? 'All Types' : t === 'postpaid' ? 'Postpaid' : 'Prepaid'}
              </button>
            ))}
            {(['value', 'price', 'speed'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition border ${sortBy === s ? 'bg-green-50 text-green-700 border-green-200' : 'bg-surface text-text-muted border-border'}`}>
                {s === 'value' ? '🏆 Best Value' : s === 'price' ? '💰 Cheapest' : '⚡ Fastest'}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="space-y-2">
          {sorted.map((p, i) => {
            const pricePerMbps = p.price > 0 ? p.price / p.speed : 0;
            return (
              <div key={i} className={`bg-surface-alt rounded-xl p-3 border ${i === 0 ? 'border-green-500 bg-green-50/30' : 'border-border'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {i === 0 && <span className="text-xs">🏆</span>}
                      <span className="text-[10px] font-bold text-primary">{p.provider}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${p.type === 'prepaid' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {p.type}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-text mt-0.5">{p.plan}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-primary">{fmt(p.price)}</div>
                    <div className="text-[10px] text-text-muted">/month{p.validity ? ` (${p.validity}d)` : ''}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted">
                  <span>📶 {p.speed} {p.speedUnit}</span>
                  <span>📊 {p.data}</span>
                  {p.price > 0 && <span>💰 {fmt(pricePerMbps)}/Mbps</span>}
                  <span>🔒 {p.lockIn > 0 ? `${p.lockIn}mo lock-in` : 'No lock-in'}</span>
                </div>
                {p.promo && <p className="text-[9px] text-green-600 mt-1">🎁 {p.promo}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
