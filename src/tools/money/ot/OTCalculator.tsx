import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

export default function OTCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'ot-calculator')!;
  const [monthlySalary, setMonthlySalary] = useState('');
  const [otHours, setOtHours] = useState('');
  const [isRestDay, setIsRestDay] = useState(false);
  const [result, setResult] = useState<{
    dailyRate: number;
    hourlyRate: number;
    otRate: number;
    otPay: number;
    totalOTPay: number;
  } | null>(null);

  const handleCalculate = () => {
    const salary = parseFloat(monthlySalary);
    const hours = parseFloat(otHours);

    if (isNaN(salary) || isNaN(hours) || salary <= 0 || hours <= 0) return;

    const dailyRate = salary / 26; // Philippine standard: 26 working days
    const hourlyRate = dailyRate / 8;

    // OT rate: 125% of hourly rate (regular day)
    // Rest day OT: 130% of hourly rate
    const otMultiplier = isRestDay ? 1.30 : 1.25;
    const otRate = hourlyRate * otMultiplier;
    const otPay = otRate * hours;

    setResult({
      dailyRate,
      hourlyRate,
      otRate,
      otPay,
      totalOTPay: otPay,
    });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `You should receive ${formatPeso(result.otPay)} for ${result ? parseFloat(otHours) : 0} hours of overtime. Your OT rate is ${formatPeso(result.otRate)}/hour.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input
          label="Monthly Salary"
          prefix="₱"
          type="number"
          value={monthlySalary}
          onChange={(e) => setMonthlySalary(e.target.value)}
          placeholder="25000"
        />
        <Input
          label="Overtime Hours"
          type="number"
          value={otHours}
          onChange={(e) => setOtHours(e.target.value)}
          placeholder="4"
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">Overtime Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsRestDay(false)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                !isRestDay
                  ? 'bg-primary text-white'
                  : 'bg-surface-alt text-text-secondary hover:bg-border'
              }`}
            >
              Regular Day (125%)
            </button>
            <button
              onClick={() => setIsRestDay(true)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isRestDay
                  ? 'bg-primary text-white'
                  : 'bg-surface-alt text-text-secondary hover:bg-border'
              }`}
            >
              Rest Day (130%)
            </button>
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full">
          Calculate OT Pay
        </Button>
      </div>

      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-primary font-medium mb-1">Estimated OT Pay</p>
              <p className="text-2xl font-bold text-primary">{formatPeso(result.totalOTPay)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Daily Rate</span>
                <span className="font-medium text-text">{formatPeso(result.dailyRate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Hourly Rate</span>
                <span className="font-medium text-text">{formatPeso(result.hourlyRate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">OT Rate ({isRestDay ? '130%' : '125%'})</span>
                <span className="font-medium text-primary">{formatPeso(result.otRate)}/hr</span>
              </div>
            </div>

            <p className="text-[10px] text-text-muted text-center">
              ⚠️ Based on Philippine Labor Code: 26 working days/month, 8 hrs/day
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
