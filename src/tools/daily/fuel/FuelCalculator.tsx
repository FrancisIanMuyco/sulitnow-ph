import { useState, useEffect } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso, formatNumber } from '../../../utils/format';

interface FuelData {
  lastUpdated: string;
  source: string;
  brands: { brand: string; diesel: number; unleaded91: number; premium95: number; premium97: number }[];
}

export default function FuelCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'fuel-calculator')!;
  const [fuelData, setFuelData] = useState<FuelData | null>(null);
  const [distance, setDistance] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('12');
  const [tripsPerDay, setTripsPerDay] = useState('2');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [fuelType, setFuelType] = useState<'diesel' | 'unleaded91' | 'premium95' | 'premium97'>('diesel');
  const [result, setResult] = useState<{
    perTrip: number; daily: number; weekly: number; monthly: number;
    annual: number; fuelNeeded: number; savingsTip: string;
  } | null>(null);

  useEffect(() => {
    fetch('/data/fuel-prices.json').then(r => r.json()).then(d => {
      setFuelData(d);
      // Default to cheapest diesel
      const cheapest = [...d.brands].sort((a, b) => a.diesel - b.diesel)[0];
      setSelectedBrand(cheapest.brand);
      setFuelPrice(String(cheapest.diesel));
    }).catch(() => {});
  }, []);

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    if (!fuelData) return;
    const b = fuelData.brands.find(x => x.brand === brand);
    if (b) setFuelPrice(String(b[fuelType]));
  };

  const handleFuelTypeChange = (type: typeof fuelType) => {
    setFuelType(type);
    if (!fuelData || !selectedBrand) return;
    const b = fuelData.brands.find(x => x.brand === selectedBrand);
    if (b) setFuelPrice(String(b[type]));
  };

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
    const fiveKmSaved = (5 / e) * p * t * 30;
    setResult({ perTrip, daily, weekly, monthly, annual, fuelNeeded,
      savingsTip: `Reducing your route by 5 km could save approximately ${formatPeso(fiveKmSaved)}/month.` });
  };

  return (
    <ToolLayout tool={tool}
      resultText={result ? `Monthly: ${formatPeso(result.monthly)} | Daily: ${formatPeso(result.daily)}` : undefined}
      recommendation={result ? `Monthly fuel cost: ${formatPeso(result.monthly)}. That's ~${formatPeso(result.daily)}/day or ${formatPeso(result.annual)}/year. ${result.savingsTip}` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        {/* Live fuel prices */}
        {fuelData && (
          <div className="bg-surface-alt rounded-xl p-3 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-text">⛽ Live Fuel Prices</p>
              <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <p className="text-[9px] text-text-muted mb-2">Source: {fuelData.source} | Week of Aug 25-31, 2026</p>
            {/* Brand selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
              {fuelData.brands.map(b => (
                <button key={b.brand} onClick={() => handleBrandSelect(b.brand)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition border ${selectedBrand === b.brand ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border hover:border-primary'}`}>
                  {b.brand}
                </button>
              ))}
            </div>
            {/* Fuel type */}
            <div className="flex gap-1.5 mt-2">
              {([['diesel', 'Diesel'], ['unleaded91', 'Unleaded 91'], ['premium95', 'Premium 95'], ['premium97', 'Premium 97']] as const).map(([key, label]) => (
                <button key={key} onClick={() => handleFuelTypeChange(key)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition border ${fuelType === key ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface text-text-muted border-border'}`}>
                  {label}
                </button>
              ))}
            </div>
            {/* Price comparison */}
            <div className="grid grid-cols-5 gap-1 mt-2">
              {fuelData.brands.slice(0, 5).map(b => (
                <div key={b.brand} className={`text-center p-1.5 rounded-lg border ${b.brand === selectedBrand ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <p className="text-[8px] text-text-muted">{b.brand}</p>
                  <p className="text-[10px] font-bold text-text">₱{b[fuelType]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Input label="Distance per trip (km)" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="20" />
        <Input label="Fuel Price (₱/liter)" prefix="₱" type="number" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} placeholder="60" hint="Auto-filled from live data — or enter custom price" />
        <Input label="Fuel Efficiency (km/L)" type="number" value={fuelEfficiency} onChange={(e) => setFuelEfficiency(e.target.value)} placeholder="12" hint="12 km/L motorcycle, 8 km/L SUV, 15 km/L sedan" />
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
              {[
                ['Per Trip', formatPeso(result.perTrip)],
                ['Daily', formatPeso(result.daily)],
                ['Weekly', formatPeso(result.weekly)],
                ['Annual', formatPeso(result.annual)],
              ].map(([label, val]) => (
                <div key={label} className="bg-surface-alt rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-text-muted mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-text">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
