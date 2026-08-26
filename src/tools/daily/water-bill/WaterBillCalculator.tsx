import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

const WATER_PROVIDERS = {
  manilaWater: {
    name: 'Manila Water',
    steps: [
      { max: 10, rate: 0, label: '0-10 m³ (free)' },
      { max: 20, rate: 13.95, label: '11-20 m³' },
      { max: 30, rate: 18.60, label: '21-30 m³' },
      { max: 40, rate: 24.75, label: '31-40 m³' },
      { max: 50, rate: 35.35, label: '41-50 m³' },
      { max: Infinity, rate: 52.95, label: '51+ m³' },
    ],
    sewerage: 0.40,
    serviceCharge: 0,
  },
  maynilad: {
    name: 'Maynilad',
    steps: [
      { max: 10, rate: 0, label: '0-10 m³ (free)' },
      { max: 20, rate: 14.00, label: '11-20 m³' },
      { max: 30, rate: 19.00, label: '21-30 m³' },
      { max: 40, rate: 25.50, label: '31-40 m³' },
      { max: 50, rate: 36.00, label: '41-50 m³' },
      { max: Infinity, rate: 54.00, label: '51+ m³' },
    ],
    sewerage: 0.40,
    serviceCharge: 0,
  },
  bulacan: {
    name: 'Bulacan Aqua',
    steps: [
      { max: 10, rate: 0, label: '0-10 m³ (free)' },
      { max: 20, rate: 12.50, label: '11-20 m³' },
      { max: 30, rate: 16.00, label: '21-30 m³' },
      { max: 40, rate: 22.00, label: '31-40 m³' },
      { max: 50, rate: 30.00, label: '41-50 m³' },
      { max: Infinity, rate: 45.00, label: '51+ m³' },
    ],
    sewerage: 0.35,
    serviceCharge: 0,
  },
};

function calculateBill(m3: number, provider: keyof typeof WATER_PROVIDERS) {
  const p = WATER_PROVIDERS[provider];
  let remaining = m3;
  let total = 0;
  let prevMax = 0;
  const breakdown: { label: string; m3: number; rate: number; amount: number }[] = [];

  for (const step of p.steps) {
    if (remaining <= 0) break;
    const tierM3 = Math.min(remaining, step.max - prevMax);
    const amount = tierM3 * step.rate;
    total += amount;
    if (tierM3 > 0) {
      breakdown.push({ label: step.label, m3: tierM3, rate: step.rate, amount });
    }
    remaining -= tierM3;
    prevMax = step.max;
  }

  const sewerage = m3 * p.sewerage;
  total += sewerage;
  breakdown.push({ label: 'Sewerage fee', m3, rate: p.sewerage, amount: sewerage });

  return { total, breakdown, provider: p.name };
}

export default function WaterBillCalculator() {
  const [m3, setM3] = useState('');
  const [provider, setProvider] = useState<keyof typeof WATER_PROVIDERS>('manilaWater');
  const [result, setResult] = useState<ReturnType<typeof calculateBill> | null>(null);

  const handleCalculate = () => {
    const val = parseFloat(m3);
    if (!val || val < 0) return;
    setResult(calculateBill(val, provider));
  };

  const monthlyM3 = result ? parseFloat(m3) : 0;
  const annual = result ? result.total * 12 : 0;
  const perPerson = (count: number) => result ? (result.total / count) : 0;

  return (
    <ToolLayout
      tool={{ id: 'water-bill-calculator', name: 'Water Bill Calculator', slug: 'water-bill', description: 'Estimate your monthly water bill based on consumption in cubic meters', category: 'daily', keywords: ['water', 'bill', 'manila water', 'maynilad', 'tubig'], icon: 'Droplets', status: 'active', path: '/tools/water-bill', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Water Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as keyof typeof WATER_PROVIDERS)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="manilaWater">Manila Water (East Zone)</option>
            <option value="maynilad">Maynilad (West Zone)</option>
            <option value="bulacan">Bulacan Aqua</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Water Usage (cubic meters / m³)</label>
          <input
            type="number"
            value={m3}
            onChange={(e) => setM3(e.target.value)}
            placeholder="e.g. 15"
            min="0"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <p className="text-xs text-gray-400 mt-1">1 m³ = 1,000 liters. Average Filipino household uses 10-20 m³/month.</p>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Calculate Bill
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Total */}
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated Water Bill</p>
            <p className="text-4xl font-bold text-primary">₱{result.total.toFixed(2)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {monthlyM3} m³ · {result.provider}
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm">Bill Breakdown</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {result.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.m3} m³ × ₱{item.rate.toFixed(2)}</p>
                  </div>
                  <p className="text-sm font-semibold">₱{item.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 font-bold">
              <span>Total</span>
              <span className="text-primary">₱{result.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">💡 Insights</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Annual estimate (12 months)</span>
                <span className="font-medium">₱{annual.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Per person (family of 4)</span>
                <span className="font-medium">₱{perPerson(4).toFixed(2)}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Per person (family of 6)</span>
                <span className="font-medium">₱{perPerson(6).toFixed(2)}/month</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <h3 className="font-semibold text-sm text-green-700 dark:text-green-400 mb-2">💧 Water-Saving Tips</h3>
            <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
              <li>• Fix leaky faucets — can waste up to 20 m³/month</li>
              <li>• Take shorter showers — saves 5-10 m³/month</li>
              <li>• Use a bucket instead of hose for car wash</li>
              <li>• Collect rainwater for plants</li>
            </ul>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
