import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

interface CommuteOption {
  name: string;
  oneWay: string;
  tripsPerDay: string;
}

const defaultOptions: CommuteOption[] = [
  { name: 'Jeepney', oneWay: '15', tripsPerDay: '2' },
  { name: 'Bus/UV Express', oneWay: '30', tripsPerDay: '2' },
  { name: 'Train (MRT/LRT)', oneWay: '25', tripsPerDay: '2' },
  { name: 'Motorcycle', oneWay: '10', tripsPerDay: '2' },
];

export default function CommuteCostCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'commute-cost')!;
  const [options, setOptions] = useState(defaultOptions);
  const [daysPerMonth, setDaysPerMonth] = useState('22');
  const [result, setResult] = useState<{
    results: { name: string; daily: number; monthly: number; annual: number }[];
    cheapest: string;
  } | null>(null);

  const update = (index: number, field: keyof CommuteOption, value: string) => {
    setOptions(options.map((o, i) => i === index ? { ...o, [field]: value } : o));
  };

  const handleCalculate = () => {
    const days = parseInt(daysPerMonth) || 22;
    const results = options.map((o) => {
      const fare = parseFloat(o.oneWay) || 0;
      const trips = parseInt(o.tripsPerDay) || 2;
      const daily = fare * trips;
      const monthly = daily * days;
      const annual = monthly * 12;
      return { name: o.name, daily, monthly, annual };
    });

    const cheapest = results.reduce((a, b) => a.monthly < b.monthly ? a : b).name;
    setResult({ results, cheapest });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `The cheapest option is ${result.cheapest}.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <p className="text-xs text-text-secondary">Compare commuting costs across different transport options:</p>

        {options.map((opt, i) => (
          <div key={opt.name} className="bg-surface-alt rounded-xl p-3">
            <span className="text-xs font-medium text-text">{opt.name}</span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="block text-[10px] text-text-muted mb-0.5">One-way fare (₱)</label>
                <input type="number" value={opt.oneWay} onChange={(e) => update(i, 'oneWay', e.target.value)} className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-white dark:bg-slate-800 text-text focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-[10px] text-text-muted mb-0.5">Trips per day</label>
                <input type="number" value={opt.tripsPerDay} onChange={(e) => update(i, 'tripsPerDay', e.target.value)} className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-white dark:bg-slate-800 text-text focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          </div>
        ))}

        <Input label="Working Days per Month" type="number" value={daysPerMonth} onChange={(e) => setDaysPerMonth(e.target.value)} placeholder="22" />
        <Button onClick={handleCalculate} className="w-full">Compare Costs</Button>
      </div>

      {result && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="space-y-2">
            {result.results.sort((a, b) => a.monthly - b.monthly).map((r, i) => (
              <div key={r.name} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 'bg-surface-alt'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    {i === 0 && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-medium">CHEAPEST</span>}
                    <span className="text-sm font-medium text-text">{r.name}</span>
                  </div>
                  <span className="text-xs text-text-muted">{formatPeso(r.daily)}/day</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${i === 0 ? 'text-green-600' : 'text-text'}`}>{formatPeso(r.monthly)}</p>
                  <p className="text-[10px] text-text-muted">/month</p>
                </div>
              </div>
            ))}
          </div>
          {result.results.length > 1 && (
            <p className="text-xs text-text-secondary text-center">
              You save {formatPeso(result.results[result.results.length - 1].monthly - result.results[0].monthly)}/month choosing {result.cheapest} over {result.results[result.results.length - 1].name}.
            </p>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
