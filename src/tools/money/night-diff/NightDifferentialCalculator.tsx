import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

export default function NightDifferentialCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'night-differential')!;
  const [monthlySalary, setMonthlySalary] = useState('');
  const [nightHours, setNightHours] = useState('');
  const [result, setResult] = useState<{
    hourlyRate: number;
    ndRate: number;
    ndPay: number;
  } | null>(null);

  const handleCalculate = () => {
    const salary = parseFloat(monthlySalary);
    const hours = parseFloat(nightHours);

    if (isNaN(salary) || isNaN(hours) || salary <= 0 || hours <= 0) return;

    const hourlyRate = salary / 26 / 8;
    const ndRate = hourlyRate * 1.10; // 10% premium
    const ndPay = ndRate * hours;

    setResult({ hourlyRate, ndRate, ndPay });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `Night differential pay: ${formatPeso(result.ndPay)} for ${nightHours} hours. Rate: ${formatPeso(result.ndRate)}/hr (110% of regular hourly).` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input label="Monthly Salary" prefix="₱" type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="25000" />
        <Input label="Night Hours (10PM - 6AM)" type="number" value={nightHours} onChange={(e) => setNightHours(e.target.value)} placeholder="4" />
        <Button onClick={handleCalculate} className="w-full">Calculate ND Pay</Button>
      </div>
      {result && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-primary font-medium mb-1">Night Differential Pay</p>
            <p className="text-2xl font-bold text-primary">{formatPeso(result.ndPay)}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Hourly Rate</span><span className="font-medium text-text">{formatPeso(result.hourlyRate)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-secondary">ND Rate (110%)</span><span className="font-medium text-primary">{formatPeso(result.ndRate)}/hr</span></div>
          </div>
          <p className="text-[10px] text-text-muted text-center">⚠️ Night differential: 10% premium for work between 10PM-6AM</p>
        </div>
      )}
    </ToolLayout>
  );
}
