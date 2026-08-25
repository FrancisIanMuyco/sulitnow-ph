import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

export default function ThirteenthMonthCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'thirteenth-month')!;
  const [monthlySalary, setMonthlySalary] = useState('');
  const [monthsWorked, setMonthsWorked] = useState('12');
  const [result, setResult] = useState<{
    totalSalary: number;
    thirteenthMonth: number;
  } | null>(null);

  const handleCalculate = () => {
    const salary = parseFloat(monthlySalary);
    const months = parseInt(monthsWorked);

    if (isNaN(salary) || isNaN(months) || salary <= 0 || months <= 0 || months > 12) return;

    const totalSalary = salary * months;
    const thirteenthMonth = totalSalary / 12;

    setResult({ totalSalary, thirteenthMonth });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `Your estimated 13th month pay is ${formatPeso(result.thirteenthMonth)}. This is equivalent to one month's salary.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input label="Monthly Salary" prefix="₱" type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="25000" />
        <Input label="Months Worked" type="number" value={monthsWorked} onChange={(e) => setMonthsWorked(e.target.value)} placeholder="12" hint="Number of months worked this year (max 12)" />
        <Button onClick={handleCalculate} className="w-full">Calculate 13th Month</Button>
      </div>
      {result && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-primary font-medium mb-1">Estimated 13th Month Pay</p>
            <p className="text-2xl font-bold text-primary">{formatPeso(result.thirteenthMonth)}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Total Salary Earned</span><span className="font-medium text-text">{formatPeso(result.totalSalary)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-secondary">13th Month (÷12)</span><span className="font-medium text-primary">{formatPeso(result.thirteenthMonth)}</span></div>
          </div>
          <p className="text-[10px] text-text-muted text-center">⚠️ Mandatory in the Philippines. Based on total basic salary earned during the year.</p>
        </div>
      )}
    </ToolLayout>
  );
}
