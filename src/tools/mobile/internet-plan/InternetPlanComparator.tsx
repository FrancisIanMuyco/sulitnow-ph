import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { Globe } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'internet-plan-comparator')!;

interface Plan {
  provider: string;
  name: string;
  price: number;
  speed: number; // Mbps
  type: string; // Fiber, DSL, Wireless, etc
  lockIn: string;
  dataCap: string;
}

const PLANS: Plan[] = [
  // Globe
  { provider: 'Globe', name: 'Globe At Home Prepaid WiFi', price: 0, speed: 10, type: 'Wireless', lockIn: 'None', dataCap: 'Varies by promo' },
  { provider: 'Globe', name: 'GFiber 1299', price: 1299, speed: 25, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'Globe', name: 'GFiber 1699', price: 1699, speed: 50, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'Globe', name: 'GFiber 2099', price: 2099, speed: 100, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'Globe', name: 'GFiber 2499', price: 2499, speed: 300, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  // PLDT
  { provider: 'PLDT', name: 'Fibr Unli Plan 1299', price: 1299, speed: 25, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'PLDT', name: 'Fibr Unli Plan 1699', price: 1699, speed: 50, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'PLDT', name: 'Fibr Unli Plan 2099', price: 2099, speed: 100, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'PLDT', name: 'Fibr Unli Plan 2699', price: 2699, speed: 300, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'PLDT', name: 'Fibr Unli Plan 3599', price: 3599, speed: 600, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  // Converge
  { provider: 'Converge', name: 'FiberX 1500', price: 1500, speed: 35, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'Converge', name: 'FiberX 2000', price: 2000, speed: 100, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'Converge', name: 'FiberX 2500', price: 2500, speed: 200, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'Converge', name: 'FiberX 3500', price: 3500, speed: 400, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  // Sky
  { provider: 'Sky', name: 'Sky Fiber 899', price: 899, speed: 20, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'Sky', name: 'Sky Fiber 1299', price: 1299, speed: 40, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'Sky', name: 'Sky Fiber 1499', price: 1499, speed: 60, type: 'Fiber', lockIn: 'None', dataCap: 'Unlimited' },
  // Smart/BLIK
  { provider: 'Smart', name: 'Smart Bro 5G 999', price: 999, speed: 20, type: '5G Wireless', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'Smart', name: 'Smart Bro 5G 1499', price: 1499, speed: 50, type: '5G Wireless', lockIn: 'None', dataCap: 'Unlimited' },
  // DITO
  { provider: 'DITO', name: 'DITO Home 5G 888', price: 888, speed: 15, type: '5G Wireless', lockIn: 'None', dataCap: 'Unlimited' },
  { provider: 'DITO', name: 'DITO Home 5G 1488', price: 1488, speed: 30, type: '5G Wireless', lockIn: 'None', dataCap: 'Unlimited' },
];

export default function InternetPlanComparator() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'price' | 'speed' | 'value'>('value');

  const filtered = PLANS.filter(p => filter === 'all' || p.provider === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'speed') return b.speed - a.speed;
    const valA = a.price > 0 ? a.speed / a.price : 999;
    const valB = b.price > 0 ? b.speed / b.price : 999;
    return valB - valA;
  });

  const providers = ['all', 'Globe', 'PLDT', 'Converge', 'Sky', 'Smart', 'DITO'];
  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH');

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Internet Plan Comparator</h3>
          </div>
          <div className="text-[10px] text-text-muted mb-3">💡 Prices based on published plan rates. Last updated: Aug 2026.</div>
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
            {providers.map(p => (
              <button key={p} onClick={() => setFilter(p)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${filter === p ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border hover:border-primary'}`}>
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            {(['value', 'price', 'speed'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} className={`px-2 py-1 rounded text-[10px] font-semibold transition border ${sortBy === s ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface text-text-muted border-border'}`}>
                {s === 'value' ? 'Best Value' : s === 'price' ? 'Lowest Price' : 'Fastest'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {sorted.map((p, i) => {
            const pricePerMbps = p.price > 0 ? p.price / p.speed : 0;
            return (
              <div key={i} className={`bg-surface-alt rounded-xl p-3 border ${i === 0 ? 'border-green-500' : 'border-border'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {i === 0 && <span className="text-xs">🏆</span>}
                      <span className="text-[10px] font-bold text-primary">{p.provider}</span>
                      <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded text-text-muted">{p.type}</span>
                    </div>
                    <div className="text-sm font-semibold text-text mt-0.5">{p.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-primary">{p.price > 0 ? fmt(p.price) : 'Free'}</div>
                    <div className="text-[10px] text-text-muted">/month</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted">
                  <span>📶 {p.speed} Mbps</span>
                  <span>📊 {p.dataCap}</span>
                  {p.price > 0 && <span>💰 {fmt(pricePerMbps)}/Mbps</span>}
                  <span>🔒 {p.lockIn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
