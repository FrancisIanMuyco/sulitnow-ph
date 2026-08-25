import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Array<{ name: string; balance: number; rate: number; minPayment: number }>>([
    { name: 'Credit Card', balance: 0, rate: 0, minPayment: 0 },
  ]);
  const [extraPayment, setExtraPayment] = useState('');
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('avalanche');

  const addDebt = () => setDebts([...debts, { name: `Debt ${debts.length + 1}`, balance: 0, rate: 0, minPayment: 0 }]);
  const removeDebt = (i: number) => setDebts(debts.filter((_, idx) => idx !== i));
  const updateDebt = (i: number, field: string, value: any) => {
    const updated = [...debts];
    (updated[i] as any)[field] = field === 'name' ? value : parseFloat(value) || 0;
    setDebts(updated);
  };

  const extra = parseFloat(extraPayment) || 0;
  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);


  // Simple payoff calculation
  const calculatePayoff = () => {
    let remaining = debts.map(d => ({ ...d }));
    let months = 0;
    let totalInterest = 0;
    const maxMonths = 600; // 50 year safety

    // Sort by strategy
    if (strategy === 'snowball') remaining.sort((a, b) => a.balance - b.balance);
    else remaining.sort((a, b) => b.rate - a.rate);

    while (remaining.some(d => d.balance > 0) && months < maxMonths) {
      months++;
      let extraLeft = extra;

      // Pay minimums + interest
      for (const debt of remaining) {
        if (debt.balance <= 0) continue;
        const interest = debt.balance * (debt.rate / 100 / 12);
        totalInterest += interest;
        debt.balance += interest;
        const payment = Math.min(debt.balance, debt.minPayment);
        debt.balance -= payment;
      }

      // Apply extra to first debt with balance
      for (const debt of remaining) {
        if (debt.balance <= 0 || extraLeft <= 0) continue;
        const payment = Math.min(debt.balance, extraLeft);
        debt.balance -= payment;
        extraLeft -= payment;
      }
    }

    return { months, totalInterest, totalPaid: totalDebt + totalInterest };
  };

  const result = totalDebt > 0 ? calculatePayoff() : null;

  return (
    <ToolLayout
      tool={{ id: 'debt-payoff', name: 'Debt Payoff Calculator', slug: 'debt-payoff', description: 'Plan your debt payoff strategy using snowball or avalanche method.', category: 'money', keywords: ['debt', 'payoff', 'credit', 'card', 'loan', 'utang', 'snowball', 'avalanche'], icon: 'TrendingDown', status: 'active', path: '/tools/debt-payoff', requiresApi: false }}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['avalanche', 'snowball'] as const).map(s => (
            <button key={s} onClick={() => setStrategy(s)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border ${strategy === s ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>
              {s === 'avalanche' ? '🎯 Avalanche (by rate)' : '⚡ Snowball (by amount)'}
            </button>
          ))}
        </div>

        {debts.map((debt, i) => (
          <div key={i} className="bg-surface-alt rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <input value={debt.name} onChange={e => updateDebt(i, 'name', e.target.value)}
                className="text-sm font-semibold bg-transparent border-none outline-none flex-1" />
              {debts.length > 1 && (
                <button onClick={() => removeDebt(i)} className="text-red-400 text-xs hover:text-red-600">✕</button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-text-muted">Balance (₱)</label>
                <input type="number" value={debt.balance || ''} onChange={e => updateDebt(i, 'balance', e.target.value)} placeholder="0"
                  className="w-full px-2 py-1.5 bg-surface border border-border rounded-lg text-xs" />
              </div>
              <div>
                <label className="text-[10px] text-text-muted">Rate (%/yr)</label>
                <input type="number" value={debt.rate || ''} onChange={e => updateDebt(i, 'rate', e.target.value)} placeholder="0"
                  className="w-full px-2 py-1.5 bg-surface border border-border rounded-lg text-xs" />
              </div>
              <div>
                <label className="text-[10px] text-text-muted">Min Pay (₱)</label>
                <input type="number" value={debt.minPayment || ''} onChange={e => updateDebt(i, 'minPayment', e.target.value)} placeholder="0"
                  className="w-full px-2 py-1.5 bg-surface border border-border rounded-lg text-xs" />
              </div>
            </div>
          </div>
        ))}

        <button onClick={addDebt} className="w-full py-2 border border-dashed border-border rounded-xl text-xs text-text-muted hover:border-primary hover:text-primary transition">+ Add Debt</button>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Extra Monthly Payment (₱)</label>
          <input type="number" value={extraPayment} onChange={e => setExtraPayment(e.target.value)} placeholder="0"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        {result && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Total Debt</span>
              <span className="font-bold">₱{totalDebt.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Total Interest</span>
              <span className="font-bold text-orange-500">₱{result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Months to Pay Off</span>
              <span className="font-bold text-primary">{result.months} months ({(result.months / 12).toFixed(1)} years)</span>
            </div>
            <div className="flex justify-between text-sm border-t border-primary/20 pt-2">
              <span className="font-semibold">Total Paid</span>
              <span className="font-bold">₱{result.totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        )}

        <div className="bg-surface-alt rounded-xl p-3 text-xs text-text-muted">
          <p><strong>Avalanche:</strong> Pay highest interest rate first (saves most money)</p>
          <p className="mt-1"><strong>Snowball:</strong> Pay smallest balance first (quick wins for motivation)</p>
        </div>
      </div>
    </ToolLayout>
  );
}
