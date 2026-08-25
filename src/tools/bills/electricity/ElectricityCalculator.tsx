import { useState, useEffect } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

interface ElectricityData {
  lastUpdated: string;
  source: string;
  billingMonth: string;
  rates: {
    meralco: { overallRate: number; previousRate: number; change: number; note: string };
    components: Record<string, number>;
  };
  historical: { month: string; rate: number; change: number }[];
}

export default function ElectricityCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'electricity-calculator')!;
  const [data, setData] = useState<ElectricityData | null>(null);
  const [kwh, setKwh] = useState('');
  const [rate, setRate] = useState('');
  const [result, setResult] = useState<{ dailyCost: number; monthlyCost: number; annualCost: number } | null>(null);

  useEffect(() => {
    fetch('/data/electricity-rates.json').then(r => r.json()).then(d => {
      setData(d);
      setRate(String(d.rates.meralco.overallRate));
    }).catch(() => {});
  }, []);

  const handleCalculate = () => {
    const k = parseFloat(kwh);
    const r = parseFloat(rate);
    if (isNaN(k) || isNaN(r) || k <= 0 || r <= 0) return;
    setResult({ dailyCost: k * r / 30, monthlyCost: k * r, annualCost: k * r * 12 });
  };

  return (
    <ToolLayout tool={tool}
      recommendation={result ? `Estimated monthly electricity cost: ${formatPeso(result.monthlyCost)} for ${kwh} kWh. That's ~${formatPeso(result.dailyCost)}/day or ${formatPeso(result.annualCost)}/year.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        {/* Live Meralco rate */}
        {data && (
          <div className="bg-surface-alt rounded-xl p-3 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-text">💡 Meralco Rate — {data.billingMonth}</p>
              <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 text-center mb-2">
              <p className="text-2xl font-bold text-primary">₱{data.rates.meralco.overallRate}</p>
              <p className="text-[10px] text-text-muted">per kWh (overall rate)</p>
              <p className="text-[10px] text-green-600 mt-1">↓ ₱{Math.abs(data.rates.meralco.change).toFixed(4)} from last month</p>
            </div>
            <p className="text-[9px] text-text-muted mb-2">{data.rates.meralco.note}</p>
            {/* Rate breakdown */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-text mb-1">Rate Breakdown:</p>
              {Object.entries(data.rates.components).map(([key, val]) => (
                <div key={key} className="flex justify-between text-[10px]">
                  <span className="text-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-text font-medium">₱{val.toFixed(4)}</span>
                </div>
              ))}
            </div>
            {/* Historical */}
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-[10px] font-semibold text-text mb-1">Rate History:</p>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {data.historical.map(h => (
                  <div key={h.month} className="text-center min-w-[60px]">
                    <p className="text-[8px] text-text-muted">{h.month.replace(' 2026', '')}</p>
                    <p className="text-[10px] font-bold text-text">₱{h.rate}</p>
                    <p className={`text-[8px] ${h.change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {h.change > 0 ? '↑' : '↓'}₱{Math.abs(h.change).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Input label="Monthly Usage (kWh)" type="number" value={kwh} onChange={(e) => setKwh(e.target.value)} placeholder="200" hint="Check your Meralco bill for total kWh" />
        <Input label="Rate per kWh (₱)" prefix="₱" type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="14.78" hint="Auto-filled with current Meralco rate" />
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
          {/* Common appliance estimates */}
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-[10px] font-semibold text-text mb-2">Common Appliance Costs (at current rate):</p>
            <div className="space-y-1">
              {[
                ['Electric Fan (12hrs)', 0.12 * 12 * data!.rates.meralco.overallRate],
                ['Aircon 1HP (8hrs)', 1.0 * 8 * data!.rates.meralco.overallRate],
                ['Refrigerator (24hrs)', 0.15 * 24 * data!.rates.meralco.overallRate],
                ['TV + Sound (6hrs)', 0.2 * 6 * data!.rates.meralco.overallRate],
                ['Washing Machine (1 cycle)', 0.5 * data!.rates.meralco.overallRate],
              ].map(([name, cost]) => (
                <div key={name} className="flex justify-between text-[10px]">
                  <span className="text-text-muted">{name as string}</span>
                  <span className="text-text font-medium">{formatPeso(cost as number)}/day</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-text-muted text-center">⚠️ Estimates only. Actual cost depends on Meralco's tiered pricing and usage pattern.</p>
        </div>
      )}
    </ToolLayout>
  );
}
