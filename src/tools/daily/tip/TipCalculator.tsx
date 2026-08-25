import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState(10);
  const [split, setSplit] = useState(1);

  const billAmt = parseFloat(bill) || 0;
  const tipAmt = billAmt * (tipPercent / 100);
  const total = billAmt + tipAmt;
  const perPerson = split > 0 ? total / split : total;
  const tipPerPerson = split > 0 ? tipAmt / split : tipAmt;

  return (
    <ToolLayout
      tool={{ id: 'tip-calculator', name: 'Tip Calculator', slug: 'tip-calculator', description: 'Calculate tip amount and split bills with friends.', category: 'daily', keywords: ['tip', 'bill', 'split', 'restaurant', 'food', 'kaon'], icon: 'Utensils', status: 'active', path: '/tools/tip-calculator', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Bill Amount (₱)</label>
          <input type="number" value={bill} onChange={e => setBill(e.target.value)} placeholder="0.00"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Tip: {tipPercent}%</label>
          <input type="range" min="0" max="30" step="1" value={tipPercent} onChange={e => setTipPercent(Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>0%</span><span>15%</span><span>30%</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[5, 10, 15, 20].map(p => (
              <button key={p} onClick={() => setTipPercent(p)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition border ${tipPercent === p ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>
                {p}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Split between</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setSplit(Math.max(1, split - 1))} className="w-10 h-10 rounded-xl bg-surface-alt border border-border text-lg font-bold hover:bg-border transition">−</button>
            <span className="text-xl font-bold text-text w-12 text-center">{split}</span>
            <button onClick={() => setSplit(split + 1)} className="w-10 h-10 rounded-xl bg-surface-alt border border-border text-lg font-bold hover:bg-border transition">+</button>
            <span className="text-sm text-text-muted">{split === 1 ? 'person' : 'people'}</span>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Bill</span>
            <span className="font-medium">₱{billAmt.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Tip ({tipPercent}%)</span>
            <span className="font-medium text-primary">₱{tipAmt.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="border-t border-primary/20 pt-2 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
          </div>
          {split > 1 && (
            <div className="border-t border-primary/20 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Per person</span>
                <span className="font-bold text-lg">₱{perPerson.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-xs text-text-muted mt-1">Includes ₱{tipPerPerson.toFixed(2)} tip each</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
