import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { Plug } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'appliance-cost')!;

const APPLIANCES = [
  { name: 'Electric Fan', watts: 50 },
  { name: 'Aircon (1HP)', watts: 750 },
  { name: 'Aircon (1.5HP)', watts: 1100 },
  { name: 'Aircon (2HP)', watts: 1500 },
  { name: 'Refrigerator', watts: 150 },
  { name: 'Washing Machine', watts: 500 },
  { name: 'TV (LED 43")', watts: 80 },
  { name: 'TV (LED 55")', watts: 120 },
  { name: 'Desktop Computer', watts: 300 },
  { name: 'Laptop Charger', watts: 65 },
  { name: 'Rice Cooker', watts: 700 },
  { name: 'Microwave', watts: 1000 },
  { name: 'Water Heater', watts: 3000 },
  { name: 'Iron', watts: 1200 },
  { name: 'Light Bulb (LED)', watts: 10 },
  { name: 'Light Bulb (CFL)', watts: 20 },
  { name: 'Router/WiFi', watts: 15 },
  { name: 'Charger (Phone)', watts: 20 },
];

export default function ApplianceCostCalculator() {
  const [selected, setSelected] = useState('Electric Fan');
  const [customWatts, setCustomWatts] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [electricityRate, setElectricityRate] = useState('12.00');

  const appliance = APPLIANCES.find(a => a.name === selected);
  const watts = customWatts ? parseFloat(customWatts) || 0 : (appliance?.watts || 0);
  const hours = parseFloat(hoursPerDay) || 0;
  const rate = parseFloat(electricityRate) || 12;

  const dailyKwh = (watts / 1000) * hours;
  const dailyCost = dailyKwh * rate;
  const monthlyCost = dailyCost * 30;
  const yearlyCost = dailyCost * 365;

  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Plug size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Appliance Electricity Cost</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Select Appliance</label>
              <select value={selected} onChange={e => { setSelected(e.target.value); setCustomWatts(''); }} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {APPLIANCES.map(a => <option key={a.name} value={a.name}>{a.name} ({a.watts}W)</option>)}
                <option value="custom">Custom</option>
              </select>
            </div>
            {(selected === 'custom') && (
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Custom Wattage (W)</label>
                <input type="number" value={customWatts} onChange={e => setCustomWatts(e.target.value)} placeholder="e.g. 100" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Hours Used Per Day</label>
              <input type="number" value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)} placeholder="e.g. 8" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Electricity Rate (₱/kWh, default: ₱12)</label>
              <input type="number" value={electricityRate} onChange={e => setElectricityRate(e.target.value)} step="0.50" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </div>

        {watts > 0 && hours > 0 && (
          <div className="bg-surface-alt rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Cost Estimate</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-text-muted">Wattage</span><span className="text-text font-medium">{watts}W</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Daily Usage</span><span className="text-text font-medium">{dailyKwh.toFixed(2)} kWh</span></div>
              <div className="border-t border-border pt-2 mt-2 space-y-2">
                <div className="flex justify-between"><span className="text-sm text-text-muted">Daily Cost</span><span className="text-base font-bold text-text">{fmt(dailyCost)}</span></div>
                <div className="flex justify-between"><span className="text-sm text-text-muted">Monthly Cost (30 days)</span><span className="text-lg font-bold text-primary">{fmt(monthlyCost)}</span></div>
                <div className="flex justify-between"><span className="text-sm text-text-muted">Yearly Cost (365 days)</span><span className="text-lg font-bold text-text">{fmt(yearlyCost)}</span></div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-surface rounded-lg border border-border text-xs text-text-muted">
              💡 Tip: Reducing usage by 1 hour/day saves approximately <span className="font-semibold text-green-500">{fmt(dailyCost * 30)}</span>/month.
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
