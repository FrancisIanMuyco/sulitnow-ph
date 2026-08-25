import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

export default function SavingsGoalCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'savings-goal')!;
  const [goal, setGoal] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState<{
    monthlyNeeded: number;
    dailyNeeded: number;
    weeklyNeeded: number;
  } | null>(null);

  const handleCalculate = () => {
    const g = parseFloat(goal);
    const m = parseInt(months);

    if (isNaN(g) || isNaN(m) || g <= 0 || m <= 0) return;

    const monthlyNeeded = g / m;
    const dailyNeeded = monthlyNeeded / 30;
    const weeklyNeeded = monthlyNeeded / 4;

    setResult({ monthlyNeeded, dailyNeeded, weeklyNeeded });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `To reach your goal in ${months} months, save ${formatPeso(result.dailyNeeded)} per day or ${formatPeso(result.weeklyNeeded)} per week.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input
          label="Savings Goal"
          prefix="₱"
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="50000"
          hint="How much do you want to save?"
        />
        <Input
          label="Target Timeline (months)"
          type="number"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          placeholder="6"
        />
        <Button onClick={handleCalculate} className="w-full">
          Calculate Savings Plan
        </Button>
      </div>

      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-primary font-medium mb-1">Save Monthly</p>
              <p className="text-2xl font-bold text-primary">{formatPeso(result.monthlyNeeded)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-alt rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Per Week</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.weeklyNeeded)}</p>
              </div>
              <div className="bg-surface-alt rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Per Day</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.dailyNeeded)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
