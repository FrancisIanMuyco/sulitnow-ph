import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { ArrowLeftRight, Star } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'promo-comparator')!;

interface Promo {
  network: string;
  name: string;
  price: number;
  data: string;
  dataGB: number;
  calls: string;
  texts: string;
  validity: string;
  validityDays: number;
  url: string;
}

export default function PromoComparator() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [selectedA, setSelectedA] = useState<number>(0);
  const [selectedB, setSelectedB] = useState<number>(1);

  useEffect(() => {
    fetch('/data/promos.json')
      .then(r => r.json())
      .then(setPromos)
      .catch(() => {});
  }, []);

  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const promoA = promos[selectedA];
  const promoB = promos[selectedB];

  const getScore = (p: Promo) => {
    if (!p) return 0;
    const perGB = p.dataGB > 0 ? p.price / p.dataGB : p.price;
    const perDay = p.validityDays > 0 ? p.price / p.validityDays : p.price;
    const score = Math.min(10, Math.max(1, 10 - (perGB / 10) - (perDay / 5)));
    return Math.round(score * 10) / 10;
  };

  const scoreA = promoA ? getScore(promoA) : 0;
  const scoreB = promoB ? getScore(promoB) : 0;
  const best = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'Tie';

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <ArrowLeftRight size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Compare Two Promos</h3>
          </div>
          {promos.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-4">Loading promo data...</p>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Option A</label>
                <select value={selectedA} onChange={e => setSelectedA(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {promos.map((p, i) => <option key={i} value={i}>{p.network} — {p.name} ({fmt(p.price)}/{p.data})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Option B</label>
                <select value={selectedB} onChange={e => setSelectedB(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {promos.map((p, i) => <option key={i} value={i}>{p.network} — {p.name} ({fmt(p.price)}/{p.data})</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {promoA && promoB && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[{ p: promoA, score: scoreA, label: 'A' }, { p: promoB, score: scoreB, label: 'B' }].map(({ p, score, label }) => (
                <div key={label} className={`bg-surface-alt rounded-xl p-3 border ${best === label ? 'border-green-500' : 'border-border'}`}>
                  <div className="flex items-center gap-1 mb-2">
                    {best === label && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                    <span className="text-xs font-bold text-text">Option {label}</span>
                  </div>
                  <div className="text-[10px] text-primary font-semibold">{p.network}</div>
                  <div className="text-xs font-semibold text-text mb-2">{p.name}</div>
                  <div className="space-y-1 text-[10px] text-text-muted">
                    <div>💰 Price: <span className="text-text font-medium">{fmt(p.price)}</span></div>
                    <div>📶 Data: <span className="text-text font-medium">{p.data}</span></div>
                    <div>📞 {p.calls}</div>
                    <div>💬 {p.texts}</div>
                    <div>⏱️ {p.validity}</div>
                    {p.dataGB > 0 && <div>📊 Cost/GB: <span className="text-text font-medium">{fmt(p.price / p.dataGB)}</span></div>}
                  </div>
                  <div className="mt-2 p-2 bg-surface rounded-lg text-center">
                    <div className="text-[10px] text-text-muted">Sulit Score</div>
                    <div className="text-lg font-bold text-primary">{score}/10</div>
                  </div>
                </div>
              ))}
            </div>

            {best !== 'Tie' && (
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 text-center">
                <span className="text-sm font-semibold text-green-500">🏆 Option {best} is the more sulit choice!</span>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
