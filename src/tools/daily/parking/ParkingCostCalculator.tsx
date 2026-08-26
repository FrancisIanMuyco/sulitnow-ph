import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

const PARKING_RATES = [
  {
    name: 'SM Malls',
    first3hrs: 0,
    succeedingHr: 50,
    maxPerDay: 300,
    overnight: 300,
    icon: '🏬',
    notes: 'First 3 hours free for most SM malls. Rates vary per location.',
  },
  {
    name: 'Ayala Malls',
    first3hrs: 0,
    succeedingHr: 50,
    maxPerDay: 350,
    overnight: 350,
    icon: '🏬',
    notes: 'First 3 hours free. Greenbelt may differ.',
  },
  {
    name: 'Robinsons Malls',
    first3hrs: 0,
    succeedingHr: 40,
    maxPerDay: 300,
    overnight: 300,
    icon: '🏬',
    notes: 'First 3 hours free for most Robinsons malls.',
  },
  {
    name: 'Megaworld/Lifestyle',
    first3hrs: 0,
    succeedingHr: 50,
    maxPerDay: 400,
    overnight: 400,
    icon: '🏙️',
    notes: 'Eastwood, McKinley, etc.',
  },
  {
    name: 'MRT-3 / LRT Parking',
    first3hrs: 50,
    succeedingHr: 20,
    maxPerDay: 200,
    overnight: 0,
    icon: '🚇',
    notes: 'Available at select stations. Overnight not available.',
  },
  {
    name: 'Airport (NAIA)',
    first3hrs: 100,
    succeedingHr: 100,
    maxPerDay: 2500,
    overnight: 2500,
    icon: '✈️',
    notes: 'Rates vary by terminal. Terminal 1/2/3/4.',
  },
];

function calculateParking(hours: number, rate: typeof PARKING_RATES[0]) {
  if (hours <= 0) return 0;

  if (rate.first3hrs === 0) {
    if (hours <= 3) return 0;
    const extra = Math.ceil(hours - 3);
    return Math.min(extra * rate.succeedingHr, rate.maxPerDay);
  }

  // Paid from the start
  if (hours <= 3) return rate.first3hrs;
  const extra = Math.ceil(hours - 3);
  return Math.min(rate.first3hrs + extra * rate.succeedingHr, rate.maxPerDay);
}

export default function ParkingCostCalculator() {
  const [hours, setHours] = useState('3');
  const [selectedIdx, setSelectedIdx] = useState<number[]>([0, 1, 2]);
  const [results, setResults] = useState<{ name: string; icon: string; cost: number; notes: string }[]>([]);

  const handleCalculate = () => {
    const h = parseFloat(hours) || 0;
    setResults(selectedIdx.map(i => ({
      name: PARKING_RATES[i].name,
      icon: PARKING_RATES[i].icon,
      cost: calculateParking(h, PARKING_RATES[i]),
      notes: PARKING_RATES[i].notes,
    })));
  };

  const toggleSelect = (idx: number) => {
    setSelectedIdx(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <ToolLayout
      tool={{ id: 'parking-cost-calculator', name: 'Parking Cost Calculator', slug: 'parking-cost', description: 'Compare parking rates across SM, Ayala, Robinsons, airports', category: 'daily', keywords: ['parking', 'cost', 'sm', 'ayala', 'robinsons', 'mall', 'airport'], icon: 'ParkingSquare', status: 'active', path: '/tools/parking-cost', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Parking Duration (hours)</label>
          <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} min="0.5" step="0.5"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Parking Venues</label>
          <div className="space-y-1">
            {PARKING_RATES.map((p, i) => (
              <button key={p.name} onClick={() => toggleSelect(i)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                  selectedIdx.includes(i)
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                <span className="text-lg">{p.icon}</span>
                <div className="flex-1">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-gray-400 block">{p.notes}</span>
                </div>
                <span className="text-xs">₱{p.maxPerDay}/day max</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Compare Parking Costs
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            {results.sort((a, b) => a.cost - b.cost).map((r, i) => (
              <div key={r.name} className={`flex justify-between items-center px-4 py-3 rounded-xl border ${
                i === 0 && r.cost === 0
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : i === 0
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center gap-3">
                  {i === 0 && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">CHEAPEST</span>}
                  <span className="text-lg">{r.icon}</span>
                  <span className="font-medium text-sm">{r.name}</span>
                </div>
                <span className={`text-lg font-bold ${r.cost === 0 ? 'text-green-600' : ''}`}>
                  {r.cost === 0 ? 'FREE' : `₱${r.cost}`}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">💡 Parking Tips</h3>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• Most malls give first 3 hours free — use them!</li>
              <li>• Park on upper floors for more available slots</li>
              <li>• Weekend/holiday rates may differ</li>
              <li>• Use SM Advantage or Ayala Rewards for parking discounts</li>
            </ul>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
