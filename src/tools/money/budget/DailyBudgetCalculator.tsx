import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

export default function DailyBudgetCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'daily-budget')!;
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [result, setResult] = useState<{
    dailyBudget: number;
    weeklyBudget: number;
    monthlyBudget: number;
    breakdown: { label: string; amount: number; percent: number }[];
  } | null>(null);

  const handleCalculate = () => {
    const income = parseFloat(monthlyIncome);
    const fixed = parseFloat(fixedExpenses) || 0;
    const savings = parseFloat(savingsGoal) || 0;

    if (isNaN(income) || income <= 0) return;

    const monthlyBudget = income - fixed - savings;
    const dailyBudget = monthlyBudget / 30;
    const weeklyBudget = dailyBudget * 7;

    const breakdown = [
      { label: 'Fixed Expenses', amount: fixed, percent: (fixed / income) * 100 },
      { label: 'Savings Goal', amount: savings, percent: (savings / income) * 100 },
      { label: 'Daily/Weekly Budget', amount: monthlyBudget, percent: (monthlyBudget / income) * 100 },
    ].filter((b) => b.amount > 0);

    setResult({ dailyBudget, weeklyBudget, monthlyBudget, breakdown });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `You have ${formatPeso(result.dailyBudget)} per day and ${formatPeso(result.weeklyBudget)} per week for variable expenses.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input
          label="Monthly Income"
          prefix="₱"
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          placeholder="25000"
        />
        <Input
          label="Fixed Monthly Expenses"
          prefix="₱"
          type="number"
          value={fixedExpenses}
          onChange={(e) => setFixedExpenses(e.target.value)}
          placeholder="15000"
          hint="Rent, utilities, insurance, etc."
        />
        <Input
          label="Monthly Savings Goal"
          prefix="₱"
          type="number"
          value={savingsGoal}
          onChange={(e) => setSavingsGoal(e.target.value)}
          placeholder="5000"
          hint="How much you want to save per month"
        />
        <Button onClick={handleCalculate} className="w-full">
          Calculate Budget
        </Button>
      </div>

      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-primary font-medium mb-1">Daily Budget</p>
              <p className="text-2xl font-bold text-primary">{formatPeso(result.dailyBudget)}</p>
              <p className="text-xs text-text-muted mt-1">per day</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-alt rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Weekly Budget</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.weeklyBudget)}</p>
              </div>
              <div className="bg-surface-alt rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Monthly Leftover</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.monthlyBudget)}</p>
              </div>
            </div>

            {result.breakdown.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-text mb-2">Monthly Breakdown</h4>
                {result.breakdown.map((b) => (
                  <div key={b.label} className="mb-2">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-text-secondary">{b.label}</span>
                      <span className="text-text">{formatPeso(b.amount)} ({Math.round(b.percent)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-alt rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${b.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
