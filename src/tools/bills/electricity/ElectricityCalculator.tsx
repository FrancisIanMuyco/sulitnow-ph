import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

export default function ElectricityCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'electricity-calculator')!;
  const [kwh, setKwh] = useState('');
  const [rate, setRate] = useState('12');
  const [result, setResult] = useState<{
    dailyCost: number;
    monthlyCost: number;
    annualCost: number;
  } | null>(null);

  const handleCalculate = () => {
    const k = parseFloat(kwh);
    const r = parseFloat(rate);
    if (isNaN(k) || isNaN(r) || k <= 0 || r <= 0) return;
    const monthlyCost = k * r;
    const dailyCost = monthlyCost / 30;
    const annualCost = monthlyCost * 12;
    setResult({ dailyCost, monthlyCost, annualCost });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `Your estimated monthly electricity cost is ${formatPeso(result.monthlyCost)} for ${kwh} kWh. That's about ${formatPeso(result.dailyCost)} per day.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input label="Monthly Usage (kWh)" type="number" value={kwh} onChange={(e) => setKwh(e.target.value)} placeholder="200" hint="Check your Meralco bill for total kWh" />
        <Input label="Rate per kWh (₱)" prefix="₱" type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="12" hint="Meralco rate varies ₱9-₱14/kWh depending on usage" />
        <Button onClick={handleCalculate} className="w-full">Calculate Cost</Button>
      </div>
      {result && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-primary font-medium mb-1">Estimated Monthly Cost</p>
            <p className="text-2xl font-bold text-primary">{formatPeso(result.monthlyCost)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-alt rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted mb-0.5">Daily</p>
              <p className="text-sm font-bold text-text">{formatPeso(result.dailyCost)}</p>
            </div>
            <div className="bg-surface-alt rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted mb-0.5">Annual</p>
              <p className="text-sm font-bold text-text">{formatPeso(result.annualCost)}</p>
            </div>
          </div>
          <p className="text-[10px] text-text-muted text-center">⚠️ Estimates only. Actual cost depends on Meralco's tiered pricing.</p>
        </div>
      )}
    </ToolLayout>
  );
}
