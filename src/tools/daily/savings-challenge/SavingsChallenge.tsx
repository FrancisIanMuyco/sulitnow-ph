import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { Trophy } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'savings-challenge')!;

const CHALLENGES = [
  { name: '30-Day ₱50 Challenge', description: 'Save ₱50/day for 30 days', total: 1500, daily: 50, days: 30 },
  { name: '30-Day ₱100 Challenge', description: 'Save ₱100/day for 30 days', total: 3000, daily: 100, days: 30 },
  { name: '30-Day ₱200 Challenge', description: 'Save ₱200/day for 30 days', total: 6000, daily: 200, days: 30 },
  { name: '52-Week Challenge', description: 'Save ₱50/week, increasing ₱50 each week', total: 68900, daily: 0, days: 364 },
  { name: 'Envelope Challenge (52 weeks)', description: 'Random amount each week from ₱50-₱500', total: 13260, daily: 0, days: 364 },
  { name: 'No-Spend Days (20/month)', description: 'Skip spending 20 days/month, save average daily expense', total: 0, daily: 0, days: 30 },
];

export default function SavingsChallenge() {
  const [selected, setSelected] = useState(0);
  const [dailyExpense, setDailyExpense] = useState('500');
  const [noSpendDays, setNoSpendDays] = useState('20');

  const challenge = CHALLENGES[selected];
  const expense = parseFloat(dailyExpense) || 500;
  const noSpend = parseInt(noSpendDays) || 20;

  let monthlySaved = challenge.total > 0 ? challenge.total : (expense * noSpend);
  let yearlySaved = monthlySaved * 12;

  // Generate 30-day grid for tracking
  const grid = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    amount: selected === 0 ? 50 : selected === 1 ? 100 : selected === 2 ? 200 : Math.floor(Math.random() * 450) + 50,
    saved: false,
  }));

  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Savings Challenges</h3>
          </div>
          <div className="space-y-2">
            {CHALLENGES.map((c, i) => (
              <button key={i} onClick={() => setSelected(i)} className={`w-full text-left p-3 rounded-lg border transition ${selected === i ? 'border-primary bg-primary/5' : 'border-border bg-surface hover:border-primary/50'}`}>
                <div className="text-sm font-semibold text-text">{c.name}</div>
                <div className="text-xs text-text-muted">{c.description}</div>
              </button>
            ))}
          </div>
          {selected === 5 && (
            <div className="mt-3 space-y-2">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Average Daily Expense (₱)</label>
                <input type="number" value={dailyExpense} onChange={e => setDailyExpense(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">No-Spend Days per Month</label>
                <input type="number" value={noSpendDays} onChange={e => setNoSpendDays(e.target.value)} min={1} max={30} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          )}
        </div>

        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Challenge Results</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-text-muted">Monthly Savings</span><span className="text-lg font-bold text-primary">{fmt(monthlySaved)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-muted">Yearly Savings</span><span className="text-lg font-bold text-green-500">{fmt(yearlySaved)}</span></div>
            <div className="bg-green-500/10 rounded-lg p-3 text-center mt-2">
              <span className="text-sm font-semibold text-green-500">🎯 If you do this for 1 year, you'll save {fmt(yearlySaved)}!</span>
            </div>
          </div>
        </div>

        {(selected === 0 || selected === 1 || selected === 2) && (
          <div className="bg-surface-alt rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">30-Day Tracker</h4>
            <div className="grid grid-cols-6 gap-1.5">
              {grid.map((g) => (
                <div key={g.day} className="aspect-square rounded-lg bg-surface border border-border flex flex-col items-center justify-center text-[10px] text-text-muted">
                  <span className="font-semibold">{g.day}</span>
                  <span>₱{selected === 0 ? 50 : selected === 1 ? 100 : 200}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-2 text-center">✅ Check off each day you save!</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
