import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

export default function DailyWageCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'daily-wage-calculator')!;
  const [monthlySalary, setMonthlySalary] = useState('');
  const [result, setResult] = useState<{ daily: number; hourly: number; weekly: number } | null>(null);

  const handleCalculate = () => {
    const salary = parseFloat(monthlySalary);
    if (isNaN(salary) || salary <= 0) return;
    const daily = salary / 26;
    const hourly = daily / 8;
    const weekly = daily * 6;
    setResult({ daily, hourly, weekly });
  };

  return (
    <ToolLayout tool={tool} recommendation={result ? `Your daily wage is ${formatPeso(result.daily)}, hourly rate is ${formatPeso(result.hourly)}.` : undefined}>
      <div className="px-4 py-4 space-y-4">
        <Input label="Monthly Salary" prefix="₱" type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="25000" hint="Based on 26 working days per month" />
        <Button onClick={handleCalculate} className="w-full">Calculate Daily Wage</Button>
      </div>
      {result && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-primary font-medium mb-1">Daily Wage</p>
            <p className="text-2xl font-bold text-primary">{formatPeso(result.daily)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-alt rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted mb-0.5">Hourly</p>
              <p className="text-sm font-bold text-text">{formatPeso(result.hourly)}</p>
            </div>
            <div className="bg-surface-alt rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted mb-0.5">Weekly (6 days)</p>
              <p className="text-sm font-bold text-text">{formatPeso(result.weekly)}</p>
            </div>
          </div>
          <p className="text-[10px] text-text-muted text-center">Based on Philippine standard: 26 working days, 8 hours/day</p>
        </div>
      )}
    </ToolLayout>
  );
}
