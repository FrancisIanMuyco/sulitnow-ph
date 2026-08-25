import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { ListChecks, Plus, Trash2 } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'subscription-tracker')!;

const PRESETS = [
  { name: 'Netflix', amount: 149, cycle: 'monthly' },
  { name: 'Spotify', amount: 75, cycle: 'monthly' },
  { name: 'Disney+', amount: 159, cycle: 'monthly' },
  { name: 'ViU', amount: 99, cycle: 'monthly' },
  { name: 'HBO Go', amount: 99, cycle: 'monthly' },
  { name: 'YouTube Premium', amount: 159, cycle: 'monthly' },
  { name: 'Microsoft 365', amount: 299, cycle: 'monthly' },
  { name: 'Google One 100GB', amount: 130, cycle: 'monthly' },
  { name: 'ChatGPT Plus', amount: 1100, cycle: 'monthly' },
  { name: 'Adobe Creative Cloud', amount: 1200, cycle: 'monthly' },
  { name: 'Canva Pro', amount: 350, cycle: 'monthly' },
  { name: 'Globe/Smart Postpaid', amount: 999, cycle: 'monthly' },
  { name: 'PLDT/Home', amount: 1299, cycle: 'monthly' },
  { name: 'Globe Home WiFi', amount: 899, cycle: 'monthly' },
  { name: 'Gym Membership', amount: 800, cycle: 'monthly' },
];

interface Sub {
  name: string;
  amount: number;
  cycle: 'monthly' | 'yearly' | 'weekly';
}

export default function SubscriptionTracker() {
  const [subs, setSubs] = useState<Sub[]>([
    { name: 'Netflix', amount: 149, cycle: 'monthly' },
  ]);

  const addPreset = (preset: typeof PRESETS[0]) => {
    if (subs.find(s => s.name === preset.name)) return;
    setSubs([...subs, { name: preset.name, amount: preset.amount, cycle: preset.cycle as Sub['cycle'] }]);
  };
  const addCustom = () => setSubs([...subs, { name: '', amount: 0, cycle: 'monthly' }]);
  const removeSub = (i: number) => setSubs(subs.filter((_, idx) => idx !== i));
  const updateSub = (i: number, field: keyof Sub, val: string | number) => {
    const ns = [...subs];
    (ns[i] as any)[field] = field === 'amount' ? (parseFloat(val as string) || 0) : val;
    setSubs(ns);
  };

  const monthlyTotal = subs.reduce((sum, s) => {
    if (s.cycle === 'monthly') return sum + s.amount;
    if (s.cycle === 'yearly') return sum + s.amount / 12;
    if (s.cycle === 'weekly') return sum + s.amount * 4.33;
    return sum;
  }, 0);
  const yearlyTotal = monthlyTotal * 12;

  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListChecks size={18} className="text-primary" />
              <h3 className="text-sm font-semibold text-text">Subscription Tracker</h3>
            </div>
            <button onClick={addCustom} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold"><Plus size={14} /> Custom</button>
          </div>
          <div className="space-y-2">
            {subs.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input placeholder="Name" value={s.name} onChange={e => updateSub(i, 'name', e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg bg-surface border border-border text-text text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                <input type="number" placeholder="₱" value={s.amount || ''} onChange={e => updateSub(i, 'amount', e.target.value)} className="w-20 px-2 py-1.5 rounded-lg bg-surface border border-border text-text text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                <select value={s.cycle} onChange={e => updateSub(i, 'cycle', e.target.value)} className="w-20 px-1 py-1.5 rounded-lg bg-surface border border-border text-text text-xs">
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="weekly">Weekly</option>
                </select>
                <button onClick={() => removeSub(i)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Quick Add</h4>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.filter(p => !subs.find(s => s.name === p.name)).slice(0, 10).map(p => (
              <button key={p.name} onClick={() => addPreset(p)} className="px-2 py-1 bg-surface border border-border rounded-lg text-[10px] text-text-muted hover:border-primary hover:text-primary transition">{p.name}</button>
            ))}
          </div>
        </div>

        {subs.length > 0 && (
          <div className="bg-surface-alt rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Total</h4>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-sm text-text-muted">Monthly Total</span><span className="text-lg font-bold text-primary">{fmt(monthlyTotal)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-text-muted">Yearly Total</span><span className="text-lg font-bold text-red-500">{fmt(yearlyTotal)}</span></div>
            </div>
            <div className="mt-3 p-3 bg-surface rounded-lg border border-border text-xs text-text-muted">
              💡 You're spending <span className="font-semibold text-primary">{fmt(monthlyTotal)}/month</span> on subscriptions. That's <span className="font-semibold text-red-500">{fmt(yearlyTotal)}/year</span>.
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
