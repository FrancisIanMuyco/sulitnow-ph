import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso, formatNumber } from '../../../utils/format';

export default function FuelCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'fuel-calculator')!;
  const [distance, setDistance] = useState('');
  const [fuelPrice, setFuelPrice] = useState('60');
  const [fuelEfficiency, setFuelEfficiency] = useState('12');
  const [tripsPerDay, setTripsPerDay] = useState('2');
  const [result, setResult] = useState<{
    perTrip: number;
    daily: number;
    weekly: number;
    monthly: number;
    annual: number;
    fuelNeeded: number;
    savingsTip: string;
  } | null>(null);

  const handleCalculate = () => {
    const d = parseFloat(distance);
    const p = parseFloat(fuelPrice);
    const e = parseFloat(fuelEfficiency);
    const t = parseInt(tripsPerDay) || 2;

    if (isNaN(d) || isNaN(p) || isNaN(e) || d <= 0 || p <= 0 || e <= 0) return;

    const fuelNeeded = d / e;
    const perTrip = fuelNeeded * p;
    const daily = perTrip * t;
    const weekly = daily * 7;
    const monthly = daily * 30;
    const annual = monthly * 12;

    // Savings tip
    const fiveKmSaved = (5 / e) * p * t * 30;
    const tip = `Reducing your route by 5 km could save approximately ${formatPeso(fiveKmSaved)}/month.`;

    setResult({ perTrip, daily, weekly, monthly, annual, fuelNeeded, savingsTip: tip });
  };

  return (
    <ToolLayout
      tool={tool}
      resultText={result ? `Monthly fuel cost: ${formatPeso(result.monthly)} | Daily: ${formatPeso(result.daily)}` : undefined}
      recommendation={result ? `Monthly fuel cost: ${formatPeso(result.monthly)}. That's about ${formatPeso(result.daily)} per day or ${formatPeso(result.annual)} per year. ${result.savingsTip}` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input label="Distance per trip (km)" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="20" />
        <Input label="Fuel Price (₱/liter)" prefix="₱" type="number" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} placeholder="60" hint="Current gasoline/diesel price per liter" />
        <Input label="Fuel Efficiency (km/L)" type="number" value={fuelEfficiency} onChange={(e) => setFuelEfficiency(e.target.value)} placeholder="12" hint="e.g. 12 km/L motorcycle, 8 km/L SUV" />
        <Input label="Trips per day" type="number" value={tripsPerDay} onChange={(e) => setTripsPerDay(e.target.value)} placeholder="2" hint="Round trip = 2 trips" />
        <Button onClick={handleCalculate} className="w-full">Calculate Fuel Cost</Button>
      </div>

      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-primary font-medium mb-1">Estimated Monthly Fuel Cost</p>
              <p className="text-2xl font-bold text-primary">{formatPeso(result.monthly)}</p>
              <p className="text-xs text-text-muted mt-1">≈ {formatNumber(result.fuelNeeded)} liters per trip</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface-alt rounded-lg p-2.5 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Per Trip</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.perTrip)}</p>
              </div>
              <div className="bg-surface-alt rounded-lg p-2.5 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Daily</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.daily)}</p>
              </div>
              <div className="bg-surface-alt rounded-lg p-2.5 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Weekly</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.weekly)}</p>
              </div>
              <div className="bg-surface-alt rounded-lg p-2.5 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Annual</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.annual)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
