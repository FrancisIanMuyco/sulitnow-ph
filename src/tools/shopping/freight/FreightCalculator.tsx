import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

const couriers = [
  { name: 'J&T Express', baseRate: 85, perKg: 35, perRegion: 15, minKg: 0.5 },
  { name: 'Flash Express', baseRate: 75, perKg: 30, perRegion: 10, minKg: 0.5 },
  { name: 'JRS Express', baseRate: 90, perKg: 40, perRegion: 20, minKg: 1 },
  { name: 'Grab Express', baseRate: 100, perKg: 25, perRegion: 0, minKg: 0.5 },
  { name: 'Lalamove', baseRate: 80, perKg: 20, perRegion: 0, minKg: 0.5 },
];

export default function FreightCalculator() {
  const [weight, setWeight] = useState('');
  const [sameCity, setSameCity] = useState(true);
  const [cod, setCod] = useState(false);
  const [codAmount, setCodAmount] = useState('');

  const w = parseFloat(weight) || 0;
  const codAmt = parseFloat(codAmount) || 0;

  const results = couriers.map(c => {
    const billableKg = Math.max(c.minKg, w);
    let cost = c.baseRate + (billableKg * c.perKg) + (sameCity ? 0 : c.perRegion);
    const codFee = cod ? Math.max(25, codAmt * 0.02) : 0;
    cost += codFee;
    return { ...c, cost, codFee };
  }).sort((a, b) => a.cost - b.cost);

  const cheapest = results[0];
  const mostExp = results[results.length - 1];

  return (
    <ToolLayout
      tool={{ id: 'freight-calculator', name: 'Shipping Cost Calculator', slug: 'freight-calculator', description: 'Compare shipping rates across J&T, Flash, JRS, Grab, and Lalamove.', category: 'shopping', keywords: ['shipping', 'freight', 'courier', 'delivery', 'j&t', 'flash', 'jrs', 'grab', 'lalamove'], icon: 'Truck', status: 'active', path: '/tools/freight-calculator', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Package Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 2" step="0.1"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div className="flex gap-2">
          <button onClick={() => setSameCity(true)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border ${sameCity ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>
            Same City
          </button>
          <button onClick={() => setSameCity(false)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border ${!sameCity ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>
            Provincial
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={cod} onChange={e => setCod(e.target.checked)}
              className="w-4 h-4 rounded accent-primary" />
            Cash on Delivery (COD)
          </label>
        </div>

        {cod && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">COD Amount (₱)</label>
            <input type="number" value={codAmount} onChange={e => setCodAmount(e.target.value)} placeholder="e.g. 500"
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
        )}

        {w > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Courier Comparison</h4>
            {results.map((c, i) => (
              <div key={c.name} className={`flex items-center justify-between p-3 rounded-xl border ${i === 0 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-border bg-surface-alt'}`}>
                <div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-text-muted">Base ₱{c.baseRate} + ₱{c.perKg}/kg{c.perRegion > 0 ? ` + ₱${c.perRegion} prov` : ''}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${i === 0 ? 'text-green-600' : ''}`}>₱{c.cost.toFixed(0)}</p>
                  {i === 0 && <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">CHEAPEST</span>}
                </div>
              </div>
            ))}
            {cheapest && mostExp && (
              <p className="text-xs text-text-muted text-center mt-2">
                You save ₱{(mostExp.cost - cheapest.cost).toFixed(0)} with {cheapest.name}
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-text-muted text-center">Estimated rates based on published courier rates (2026). Actual rates may vary.</p>
      </div>
    </ToolLayout>
  );
}
