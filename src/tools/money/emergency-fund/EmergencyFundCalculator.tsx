import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');

  const expenses = parseFloat(monthlyExpenses) || 0;
  const savings = parseFloat(currentSavings) || 0;
  const perMonth = parseFloat(monthlySavings) || 0;

  // Emergency fund targets
  const target3 = expenses * 3;
  const target6 = expenses * 6;
  const target12 = expenses * 12;

  const progress3 = target3 > 0 ? Math.min(100, (savings / target3) * 100) : 0;
  const progress6 = target6 > 0 ? Math.min(100, (savings / target6) * 100) : 0;
  const progress12 = target12 > 0 ? Math.min(100, (savings / target12) * 100) : 0;

  const monthsTo3 = perMonth > 0 ? Math.max(0, Math.ceil((Math.max(0, target3 - savings)) / perMonth)) : 0;
  const monthsTo6 = perMonth > 0 ? Math.max(0, Math.ceil((Math.max(0, target6 - savings)) / perMonth)) : 0;
  const monthsTo12 = perMonth > 0 ? Math.max(0, Math.ceil((Math.max(0, target12 - savings)) / perMonth)) : 0;

  return (
    <ToolLayout
      tool={{ id: 'emergency-fund', name: 'Emergency Fund Calculator', slug: 'emergency-fund', description: 'Calculate how much you need for an emergency fund and when you\'ll reach it.', category: 'money', keywords: ['emergency', 'fund', 'savings', 'safety', 'ipon', 'reserve'], icon: 'Shield', status: 'active', path: '/tools/emergency-fund', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Monthly Expenses (₱)</label>
          <input type="number" value={monthlyExpenses} onChange={e => setMonthlyExpenses(e.target.value)} placeholder="e.g. 15000"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Current Savings (₱)</label>
          <input type="number" value={currentSavings} onChange={e => setCurrentSavings(e.target.value)} placeholder="e.g. 20000"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Monthly Savings (₱)</label>
          <input type="number" value={monthlySavings} onChange={e => setMonthlySavings(e.target.value)} placeholder="e.g. 3000"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        {expenses > 0 && (
          <div className="space-y-3">
            {[
              { label: '3 Months', target: target3, progress: progress3, months: monthsTo3, color: 'bg-yellow-500', desc: 'Minimum recommended' },
              { label: '6 Months', target: target6, progress: progress6, months: monthsTo6, color: 'bg-blue-500', desc: 'Standard recommendation' },
              { label: '12 Months', target: target12, progress: progress12, months: monthsTo12, color: 'bg-green-500', desc: 'Ideal for freelancers/OFWs' },
            ].map(t => (
              <div key={t.label} className="bg-surface-alt rounded-xl p-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">{t.label}</span>
                  <span className="text-sm text-text-muted">{t.desc}</span>
                </div>
                <p className="text-lg font-bold">₱{t.target.toLocaleString()}</p>
                <div className="w-full bg-surface rounded-full h-2 mt-2">
                  <div className={`${t.color} h-2 rounded-full transition-all`} style={{ width: `${t.progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>₱{savings.toLocaleString()} saved ({t.progress.toFixed(0)}%)</span>
                  {perMonth > 0 && t.months > 0 && <span>~{t.months} months to reach</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
