import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

interface TripCost {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  other: number;
  total: number;
  perDay: number;
  days: number;
}

function calculateBudget(data: {
  days: number;
  transport: number;
  hotelPerNight: number;
  foodPerDay: number;
  activities: number;
  other: number;
  travelers: number;
}): TripCost {
  const accommodation = data.hotelPerNight * data.days;
  const food = data.foodPerDay * data.days;
  const transport = data.transport;
  const activities = data.activities;
  const other = data.other;
  const total = transport + accommodation + food + activities + other;
  return {
    transport, accommodation, food, activities, other,
    total, perDay: total / data.days, days: data.days,
  };
}

const SAMPLE_BUDGETS = [
  { name: 'Beach Trip (3D2N)', days: 3, transport: 1500, hotelPerNight: 1200, foodPerDay: 600, activities: 800, other: 500, travelers: 2 },
  { name: 'City Staycation (2D1N)', days: 2, transport: 500, hotelPerNight: 2500, foodPerDay: 800, activities: 500, other: 300, travelers: 2 },
  { name: 'Boracay (4D3N)', days: 4, transport: 4000, hotelPerNight: 3000, foodPerDay: 1000, activities: 3000, other: 2000, travelers: 2 },
  { name: 'Baguio (3D2N)', days: 3, transport: 1000, hotelPerNight: 1500, foodPerDay: 500, activities: 500, other: 500, travelers: 2 },
];

export default function TravelBudgetPlanner() {
  const [days, setDays] = useState('3');
  const [transport, setTransport] = useState('1500');
  const [hotelPerNight, setHotelPerNight] = useState('1200');
  const [foodPerDay, setFoodPerDay] = useState('600');
  const [activities, setActivities] = useState('800');
  const [other, setOther] = useState('500');
  const [travelers, setTravelers] = useState('2');
  const [result, setResult] = useState<TripCost | null>(null);

  const handleCalculate = () => {
    const d = parseInt(days) || 1;
    setResult(calculateBudget({
      days: d,
      transport: parseFloat(transport) || 0,
      hotelPerNight: parseFloat(hotelPerNight) || 0,
      foodPerDay: parseFloat(foodPerDay) || 0,
      activities: parseFloat(activities) || 0,
      other: parseFloat(other) || 0,
      travelers: parseInt(travelers) || 1,
    }));
  };

  const applySample = (sample: typeof SAMPLE_BUDGETS[0]) => {
    setDays(String(sample.days));
    setTransport(String(sample.transport));
    setHotelPerNight(String(sample.hotelPerNight));
    setFoodPerDay(String(sample.foodPerDay));
    setActivities(String(sample.activities));
    setOther(String(sample.other));
    setTravelers(String(sample.travelers));
    setResult(calculateBudget(sample));
  };

  const travelersNum = parseInt(travelers) || 1;

  return (
    <ToolLayout
      tool={{ id: 'travel-budget', name: 'Travel Budget Planner', slug: 'travel-budget', description: 'Plan and estimate the total cost of your trip in the Philippines', category: 'daily', keywords: ['travel', 'budget', 'trip', 'vacation', 'biyahe'], icon: 'Map', status: 'active', path: '/tools/travel-budget', requiresApi: false }}
    >
      <div className="space-y-4">
        {/* Quick budgets */}
        <div>
          <label className="block text-sm font-medium mb-2">Quick Start Templates</label>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_BUDGETS.map((s) => (
              <button key={s.name} onClick={() => applySample(s)}
                className="text-left px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary text-xs">
                <span className="font-medium block">{s.name}</span>
                <span className="text-gray-400">~₱{(s.transport + s.hotelPerNight * s.days + s.foodPerDay * s.days + s.activities + s.other).toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Trip Duration (days)</label>
            <input type="number" value={days} onChange={(e) => setDays(e.target.value)} min="1" max="90"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Travelers</label>
            <input type="number" value={travelers} onChange={(e) => setTravelers(e.target.value)} min="1" max="50"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Transportation (round-trip total)</label>
          <input type="number" value={transport} onChange={(e) => setTransport(e.target.value)} placeholder="1500" min="0"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hotel/Accommodation (per night)</label>
          <input type="number" value={hotelPerNight} onChange={(e) => setHotelPerNight(e.target.value)} placeholder="1200" min="0"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Food Budget (per day)</label>
          <input type="number" value={foodPerDay} onChange={(e) => setFoodPerDay(e.target.value)} placeholder="600" min="0"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Activities & Tours</label>
            <input type="number" value={activities} onChange={(e) => setActivities(e.target.value)} placeholder="800" min="0"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Other (tips, pasalubong)</label>
            <input type="number" value={other} onChange={(e) => setOther(e.target.value)} placeholder="500" min="0"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Calculate Budget
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 mb-1">Total Trip Budget</p>
            <p className="text-4xl font-bold text-primary">₱{result.total.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">
              ₱{result.perDay.toLocaleString(undefined, { maximumFractionDigits: 0 })}/day · {travelersNum > 1 ? `₱${(result.total / travelersNum).toLocaleString(undefined, { maximumFractionDigits: 0 })}/person` : '1 traveler'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm">Cost Breakdown</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {[
                { label: '🚆 Transportation', amount: result.transport },
                { label: '🏨 Accommodation', amount: result.accommodation },
                { label: '🍽️ Food & Drinks', amount: result.food },
                { label: '🎯 Activities', amount: result.activities },
                { label: '📦 Other', amount: result.other },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-sm">{item.label}</span>
                  <div className="text-right">
                    <span className="font-semibold">₱{item.amount.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 ml-2">{(item.amount / result.total * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {travelersNum > 1 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-400 mb-2">👥 Per Person Cost</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total per person</span>
                  <span className="font-medium">₱{(result.total / travelersNum).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Per person per day</span>
                  <span className="font-medium">₱{(result.perDay / travelersNum).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2">💡 Budget Tips</h3>
            <ul className="text-sm space-y-1 text-gray-500 dark:text-gray-400">
              <li>• Book flights/transport early for cheaper rates</li>
              <li>• Consider hostels or Airbnbs instead of hotels</li>
              <li>• Eat at local carinderias to save on food</li>
              <li>• Bring ₱{((result.total * 0.1) / travelersNum).toLocaleString(undefined, { maximumFractionDigits: 0 })} extra (10% emergency buffer)</li>
            </ul>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
