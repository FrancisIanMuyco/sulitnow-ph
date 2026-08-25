import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function SalaryIncreaseCalculator() {
  const [currentSalary, setCurrentSalary] = useState('');
  const [increaseType, setIncreaseType] = useState<'percent' | 'amount'>('percent');
  const [increaseValue, setIncreaseValue] = useState('');

  const current = parseFloat(currentSalary) || 0;
  const value = parseFloat(increaseValue) || 0;
  const newSalary = increaseType === 'percent' ? current * (1 + value / 100) : current + value;
  const diff = newSalary - current;
  const percentIncrease = current > 0 ? ((diff / current) * 100) : 0;
  const annualDiff = diff * 12;
  const monthlyDiff = diff;

  return (
    <ToolLayout
      tool={{ id: 'salary-increase', name: 'Salary Increase Calculator', slug: 'salary-increase', description: 'See the impact of a salary increase on your monthly and annual income.', category: 'money', keywords: ['salary', 'increase', 'raise', 'sweldo', 'hike', 'promotion'], icon: 'TrendingUp', status: 'active', path: '/tools/salary-increase', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Current Monthly Salary (₱)</label>
          <input type="number" value={currentSalary} onChange={e => setCurrentSalary(e.target.value)} placeholder="e.g. 25000"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div className="flex gap-2">
          {(['percent', 'amount'] as const).map(t => (
            <button key={t} onClick={() => setIncreaseType(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border ${increaseType === t ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>
              {t === 'percent' ? '% Percentage' : '₱ Fixed Amount'}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            {increaseType === 'percent' ? 'Increase (%)' : 'Increase Amount (₱)'}
          </label>
          <input type="number" value={increaseValue} onChange={e => setIncreaseValue(e.target.value)} placeholder={increaseType === 'percent' ? 'e.g. 10' : 'e.g. 5000'}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        {current > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Current Salary</span>
              <span className="font-medium">₱{current.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Increase</span>
              <span className="font-medium text-green-500">+₱{diff.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({percentIncrease.toFixed(1)}%)</span>
            </div>
            <div className="border-t border-primary/20 pt-2 flex justify-between">
              <span className="font-semibold">New Salary</span>
              <span className="text-xl font-bold text-primary">₱{newSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-surface rounded-lg p-2 text-center">
                <p className="text-xs text-text-muted">Extra per Month</p>
                <p className="font-bold text-green-500">₱{monthlyDiff.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-surface rounded-lg p-2 text-center">
                <p className="text-xs text-text-muted">Extra per Year</p>
                <p className="font-bold text-green-500">₱{annualDiff.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
