import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { Gauge } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'fuel-consumption')!;

export default function FuelConsumptionCalculator() {
  const [distance, setDistance] = useState('');
  const [litersUsed, setLitersUsed] = useState('');
  const [fuelPrice, setFuelPrice] = useState('62');

  const dist = parseFloat(distance) || 0;
  const lit = parseFloat(litersUsed) || 0;
  const price = parseFloat(fuelPrice) || 62;
  const kmPerLiter = lit > 0 ? dist / lit : 0;
  const costPerKm = dist > 0 ? (lit * price) / dist : 0;
  const costPerLiterPerKm = kmPerLiter > 0 ? price / kmPerLiter : 0;

  const efficiencyRating = kmPerLiter > 0
    ? kmPerLiter >= 20 ? { label: 'Excellent', color: 'text-green-500', desc: 'Very fuel efficient — great for city driving!' }
    : kmPerLiter >= 15 ? { label: 'Good', color: 'text-green-400', desc: 'Above average fuel efficiency.' }
    : kmPerLiter >= 10 ? { label: 'Average', color: 'text-yellow-500', desc: 'Typical for sedans and small SUVs.' }
    : kmPerLiter >= 7 ? { label: 'Below Average', color: 'text-orange-500', desc: 'Consider route optimization or maintenance.' }
    : { label: 'Poor', color: 'text-red-500', desc: 'High fuel consumption. Check vehicle maintenance.' }
    : null;

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Gauge size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Fuel Efficiency Calculator</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Distance Traveled (km)</label>
              <input type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="e.g. 150" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Fuel Used (liters)</label>
              <input type="number" value={litersUsed} onChange={e => setLitersUsed(e.target.value)} placeholder="e.g. 12" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Fuel Price (₱/L, default: ₱62)</label>
              <input type="number" value={fuelPrice} onChange={e => setFuelPrice(e.target.value)} step="0.50" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </div>

        {kmPerLiter > 0 && (
          <div className="bg-surface-alt rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Results</h4>
            <div className="space-y-2">
              <div className="bg-surface rounded-lg p-3 border border-border text-center">
                <div className="text-xs text-text-muted mb-1">Fuel Efficiency</div>
                <div className="text-2xl font-bold text-primary">{kmPerLiter.toFixed(1)} km/L</div>
                {efficiencyRating && <div className={`text-sm font-semibold mt-1 ${efficiencyRating.color}`}>{efficiencyRating.label}</div>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface rounded-lg p-3 border border-border text-center">
                  <div className="text-xs text-text-muted">Cost per km</div>
                  <div className="text-base font-bold text-text">₱{costPerKm.toFixed(2)}</div>
                </div>
                <div className="bg-surface rounded-lg p-3 border border-border text-center">
                  <div className="text-xs text-text-muted">Cost per Liter</div>
                  <div className="text-base font-bold text-text">₱{costPerLiterPerKm.toFixed(2)}/km</div>
                </div>
              </div>
              {efficiencyRating && <p className="text-xs text-text-muted text-center mt-2">{efficiencyRating.desc}</p>}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
