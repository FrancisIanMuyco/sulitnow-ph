import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { Calculator } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'cost-per-gb')!;

interface Promo {
  network: string;
  name: string;
  price: number;
  data: string;
  dataGB: number;
  validity: string;
  validityDays: number;
}

export default function CostPerGB() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [customPrice, setCustomPrice] = useState('');
  const [customGB, setCustomGB] = useState('');

  useEffect(() => {
    fetch('/data/promos.json')
      .then(r => r.json())
      .then(setPromos)
      .catch(() => {});
  }, []);

  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const validPromos = promos.filter(p => p.dataGB > 0 && p.price > 0);
  const sorted = [...validPromos].sort((a, b) => (a.price / a.dataGB) - (b.price / b.dataGB));

  const cp = parseFloat(customPrice) || 0;
  const cg = parseFloat(customGB) || 0;
  const customCostPerGB = cp > 0 && cg > 0 ? cp / cg : 0;

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Calculator size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Cost Per GB Calculator</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Your Load Amount (₱)</label>
              <input type="number" value={customPrice} onChange={e => setCustomPrice(e.target.value)} placeholder="e.g. 149" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Data Included (GB)</label>
              <input type="number" value={customGB} onChange={e => setCustomGB(e.target.value)} placeholder="e.g. 8" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          {customCostPerGB > 0 && (
            <div className="mt-3 bg-surface rounded-lg p-3 border border-border text-center">
              <div className="text-xs text-text-muted">Your Cost Per GB</div>
              <div className="text-xl font-bold text-primary">{fmt(customCostPerGB)}/GB</div>
              <div className="text-[10px] text-text-muted mt-1">
                {customCostPerGB < 10 ? '🟢 Excellent value!' : customCostPerGB < 20 ? '🟡 Average value' : '🔴 Expensive — check promos below'}
              </div>
            </div>
          )}
        </div>

        {sorted.length > 0 && (
          <div className="bg-surface-alt rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Best Value Promos (by ₱/GB)</h4>
            <div className="space-y-1.5">
              {sorted.slice(0, 15).map((p, i) => {
                const costPerGB = p.price / p.dataGB;
                return (
                  <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${i === 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-surface border border-border'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        {i === 0 && <span className="text-[10px]">🏆</span>}
                        <span className="text-[10px] font-semibold text-primary">{p.network}</span>
                        <span className="text-[10px] text-text truncate">{p.name}</span>
                      </div>
                      <div className="text-[10px] text-text-muted">{fmt(p.price)} · {p.data} · {p.validity}</div>
                    </div>
                    <div className="text-sm font-bold text-primary ml-2">{fmt(costPerGB)}/GB</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
