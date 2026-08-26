import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function VehicleTripCostCalculator() {
  const [distance, setDistance] = useState('');
  const [fuelPrice, setFuelPrice] = useState('58');
  const [fuelEconomy, setFuelEconomy] = useState('12');
  const [tollTotal, setTollTotal] = useState('0');
  const [parkingFee, setParkingFee] = useState('0');
  const [result, setResult] = useState<{
    litersNeeded: number;
    fuelCost: number;
    totalCost: number;
    costPerKm: number;
    roundTrip: number;
  } | null>(null);

  const handleCalculate = () => {
    const d = parseFloat(distance);
    const fp = parseFloat(fuelPrice);
    const fe = parseFloat(fuelEconomy);
    if (!d || !fp || !fe || d <= 0 || fp <= 0 || fe <= 0) return;

    const litersNeeded = d / fe;
    const fuelCost = litersNeeded * fp;
    const toll = parseFloat(tollTotal) || 0;
    const parking = parseFloat(parkingFee) || 0;
    const totalCost = fuelCost + toll + parking;

    setResult({
      litersNeeded,
      fuelCost,
      totalCost,
      costPerKm: totalCost / d,
      roundTrip: totalCost * 2,
    });
  };

  return (
    <ToolLayout
      tool={{ id: 'vehicle-trip-cost', name: 'Vehicle Trip Cost Calculator', slug: 'vehicle-trip-cost', description: 'Estimate fuel + toll + parking cost for your road trip', category: 'daily', keywords: ['vehicle', 'trip', 'road', 'fuel', 'toll', 'parking'], icon: 'Car', status: 'active', path: '/tools/vehicle-trip-cost', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Distance (one-way, km)</label>
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g. 150" min="1"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Fuel Price (₱/L)</label>
            <input type="number" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} step="0.50" min="1"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fuel Economy (km/L)</label>
            <input type="number" value={fuelEconomy} onChange={(e) => setFuelEconomy(e.target.value)} step="0.5" min="1"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Toll Fees (₱)</label>
            <input type="number" value={tollTotal} onChange={(e) => setTollTotal(e.target.value)} placeholder="0" min="0"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parking Fee (₱)</label>
            <input type="number" value={parkingFee} onChange={(e) => setParkingFee(e.target.value)} placeholder="0" min="0"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Calculate Trip Cost
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 mb-1">Total Trip Cost (One-Way)</p>
            <p className="text-4xl font-bold text-primary">₱{result.totalCost.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">₱{result.costPerKm.toFixed(2)}/km</p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm">Breakdown</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm">⛽ Fuel ({result.litersNeeded.toFixed(1)}L)</span>
                <span className="font-semibold">₱{result.fuelCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm">🛣️ Toll Fees</span>
                <span className="font-semibold">₱{(parseFloat(tollTotal) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm">🅿️ Parking</span>
                <span className="font-semibold">₱{(parseFloat(parkingFee) || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 text-center">
              <p className="text-xs text-orange-600 mb-1">Round-Trip Cost</p>
              <p className="text-xl font-bold text-orange-600">₱{result.roundTrip.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-600 mb-1">Fuel Needed</p>
              <p className="text-xl font-bold text-blue-600">{result.litersNeeded.toFixed(1)} L</p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
