import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

type HolidayType = 'regular' | 'special' | 'rest-day' | 'regular-rest' | 'special-rest';

const holidayTypes: { value: HolidayType; label: string; multiplier: string }[] = [
  { value: 'regular', label: 'Regular Holiday (worked)', multiplier: '200%' },
  { value: 'special', label: 'Special Holiday (worked)', multiplier: '130%' },
  { value: 'rest-day', label: 'Rest Day (worked)', multiplier: '130%' },
  { value: 'regular-rest', label: 'Regular Holiday + Rest Day', multiplier: '260%' },
  { value: 'special-rest', label: 'Special Holiday + Rest Day', multiplier: '150%' },
];

export default function HolidayPayCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'holiday-pay')!;
  const [monthlySalary, setMonthlySalary] = useState('');
  const [hoursWorked, setHoursWorked] = useState('8');
  const [holidayType, setHolidayType] = useState<HolidayType>('regular');
  const [result, setResult] = useState<{
    dailyRate: number;
    hourlyRate: number;
    holidayRate: number;
    pay: number;
  } | null>(null);

  const multipliers: Record<HolidayType, number> = {
    regular: 2.0,
    special: 1.3,
    'rest-day': 1.3,
    'regular-rest': 2.6,
    'special-rest': 1.5,
  };

  const handleCalculate = () => {
    const salary = parseFloat(monthlySalary);
    const hours = parseFloat(hoursWorked);

    if (isNaN(salary) || isNaN(hours) || salary <= 0 || hours <= 0) return;

    const dailyRate = salary / 26;
    const hourlyRate = dailyRate / 8;
    const holidayRate = hourlyRate * multipliers[holidayType];
    const pay = holidayRate * hours;

    setResult({ dailyRate, hourlyRate, holidayRate, pay });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `Your holiday pay for ${hoursWorked} hours is ${formatPeso(result.pay)}.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input label="Monthly Salary" prefix="₱" type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="25000" />
        <Input label="Hours Worked" type="number" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} placeholder="8" />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">Holiday Type</label>
          <div className="space-y-1.5">
            {holidayTypes.map((ht) => (
              <button
                key={ht.value}
                onClick={() => setHolidayType(ht.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  holidayType === ht.value
                    ? 'bg-primary text-white'
                    : 'bg-surface-alt text-text-secondary hover:bg-border'
                }`}
              >
                <span>{ht.label}</span>
                <span className="opacity-70">{ht.multiplier}</span>
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full">Calculate Holiday Pay</Button>
      </div>
      {result && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-primary font-medium mb-1">Holiday Pay</p>
            <p className="text-2xl font-bold text-primary">{formatPeso(result.pay)}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Daily Rate</span><span className="font-medium text-text">{formatPeso(result.dailyRate)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Hourly Rate</span><span className="font-medium text-text">{formatPeso(result.hourlyRate)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Holiday Rate</span><span className="font-medium text-primary">{formatPeso(result.holidayRate)}/hr</span></div>
          </div>
          <p className="text-[10px] text-text-muted text-center">⚠️ Based on Philippine Labor Code. Actual pay may vary.</p>
        </div>
      )}
    </ToolLayout>
  );
}
