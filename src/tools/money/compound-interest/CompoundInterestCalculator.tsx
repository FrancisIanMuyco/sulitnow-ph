import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [compound, setCompound] = useState(12);
  const [monthlyAdd, setMonthlyAdd] = useState('');

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const t = parseFloat(years) || 0;
  const n = compound;
  const PMT = parseFloat(monthlyAdd) || 0;

  // A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
  const compoundFactor = Math.pow(1 + r / n, n * t);
  const futureValue = P * compoundFactor + PMT * ((compoundFactor - 1) / (r / n));
  const totalDeposits = P + PMT * n * t;
  const totalInterest = futureValue - totalDeposits;

  // Yearly breakdown
  const yearly = [];
  let balance = P;
  for (let y = 1; y <= Math.min(t, 30); y++) {
    const startBalance = balance;
    for (let m = 0; m < n; m++) {
      balance += PMT;
      balance *= (1 + r / n);
    }
    yearly.push({ year: y, balance, interest: balance - startBalance - PMT * n, totalDeposits: P + PMT * n * y });
  }

  return (
    <ToolLayout
      tool={{ id: 'compound-interest', name: 'Compound Interest Calculator', slug: 'compound-interest', description: 'See how your money grows with compound interest and regular contributions.', category: 'money', keywords: ['compound', 'interest', 'invest', 'grow', 'money', 'ipon', 'bank'], icon: 'LineChart', status: 'active', path: '/tools/compound-interest', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Initial Amount (₱)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="e.g. 10000"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Annual Interest Rate (%)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 6" step="0.1"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Time Period (years)</label>
          <input type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="e.g. 10"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Compound Frequency</label>
          <div className="flex gap-2">
            {[
              { label: 'Annually', value: 1 },
              { label: 'Quarterly', value: 4 },
              { label: 'Monthly', value: 12 },
              { label: 'Daily', value: 365 },
            ].map(c => (
              <button key={c.value} onClick={() => setCompound(c.value)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition border ${compound === c.value ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Regular Contribution (₱/month)</label>
          <input type="number" value={monthlyAdd} onChange={e => setMonthlyAdd(e.target.value)} placeholder="e.g. 2000"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        {P > 0 && t > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Total Deposits</span>
              <span className="font-medium">₱{totalDeposits.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Interest Earned</span>
              <span className="font-medium text-green-500">₱{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="border-t border-primary/20 pt-2 flex justify-between">
              <span className="font-semibold">Future Value</span>
              <span className="text-xl font-bold text-primary">₱{futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        )}

        {yearly.length > 0 && (
          <div className="bg-surface-alt rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-3">Year-by-Year Growth</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {yearly.map(y => (
                <div key={y.year} className="flex items-center gap-3 text-xs">
                  <span className="w-8 text-text-muted">Y{y.year}</span>
                  <div className="flex-1 bg-surface rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (y.balance / futureValue) * 100)}%` }} />
                  </div>
                  <span className="w-24 text-right font-medium">₱{y.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
