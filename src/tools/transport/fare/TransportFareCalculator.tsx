import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

interface Station { id: number; name: string; zone?: number; }

export default function TransportFareCalculator() {
  const [mode, setMode] = useState<'jeepney' | 'lrt1' | 'lrt2' | 'mrt3'>('jeepney');
  const [fareData, setFareData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [km, setKm] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [isSenior, setIsSenior] = useState(false);
  const [tripsPerDay, setTripsPerDay] = useState('2');
  const [daysPerMonth, setDaysPerMonth] = useState('22');

  useEffect(() => {
    fetch('/data/transport-fares.json')
      .then(r => r.json())
      .then(d => { setFareData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const jeepneyCalc = () => {
    if (!fareData) return null;
    const kmVal = parseFloat(km) || 0;
    const modern = mode === 'jeepney' ? 'modern' : 'traditional';
    const info = fareData.jeepney?.[modern] || fareData.jeepney?.traditional;
    if (!info || kmVal <= 0) return null;

    let fare = info.minimumFare + (kmVal - 1) * info.perKm;
    fare = Math.ceil(fare);
    let discount = 0;
    if (isStudent || isSenior) discount = fare * 0.20;
    const discountedFare = fare - discount;
    const daily = discountedFare * (parseFloat(tripsPerDay) || 2);
    const monthly = daily * (parseFloat(daysPerMonth) || 22);
    return { fare, discount, discountedFare, daily, monthly, perKm: info.perKm, minimum: info.minimumFare };
  };

  const trainCalc = () => {
    if (!fareData) return null;
    const data = fareData[mode];
    if (!data) return null;

    let stations: Station[] = data.stations || [];
    let fare = 0;
    let fareType = 'regular';
    if (isStudent || isSenior) fareType = 'studentSenior';

    if (fromStation && toStation && fromStation !== toStation) {
      const fromIdx = stations.findIndex((s: Station) => s.name === fromStation);
      const toIdx = stations.findIndex((s: Station) => s.name === toStation);
      if (fromIdx >= 0 && toIdx >= 0) {
        const zones = Math.abs(toIdx - fromIdx);
        if (mode === 'lrt1' && data.fareMatrix?.singleJourney) {
          const key = zones <= 4 ? '1Zone' : zones <= 8 ? '2Zone' : '3Zone';
          fare = data.fareMatrix.singleJourney[key]?.[fareType] || data.fareMatrix.singleJourney[key]?.regular || 0;
        } else {
          const base = data.fareMatrix?.regular || 15;
          const max = data.fareMatrix?.maxFare || 35;
          fare = Math.min(base + zones * 2, max);
          if (fareType === 'studentSenior') fare = Math.round(fare * 0.5);
        }
      }
    } else {
      fare = data.fareMatrix?.regular || 15;
      if (fareType === 'studentSenior') fare = Math.round(fare * 0.5);
    }

    const daily = fare * (parseFloat(tripsPerDay) || 2);
    const monthly = daily * (parseFloat(daysPerMonth) || 22);
    return { fare, daily, monthly, stations };
  };

  const result = mode === 'jeepney' ? jeepneyCalc() : trainCalc();
  const stations = (mode !== 'jeepney' && result && 'stations' in result) ? (result as any).stations : (fareData?.[mode]?.stations || []);
  const monthlySavingsVsJeepney = (() => {
    if (!result || mode === 'jeepney') return null;
    const kmVal = parseFloat(km) || 0;
    if (kmVal <= 0) return null;
    const jf = fareData?.jeepney?.traditional;
    if (!jf) return null;
    const jeepFare = Math.ceil(jf.minimumFare + (kmVal - 1) * jf.perKm);
    const dailyDiff = (result.fare - jeepFare) * (parseFloat(tripsPerDay) || 2);
    return dailyDiff * (parseFloat(daysPerMonth) || 22);
  })();

  return (
    <ToolLayout
      tool={{ id: 'transport-fare', name: 'Transport Fare Calculator', slug: 'transport-fare', description: 'Compute jeepney, LRT-1, LRT-2, and MRT-3 fares in the Philippines with monthly cost estimates.', category: 'daily', keywords: [], icon: 'Train', status: 'active', path: '/tools/transport-fare', requiresApi: false }}
    >
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Mode Selector */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'jeepney', label: '🚎 Jeepney', icon: '🚎' },
              { key: 'lrt1', label: '🚇 LRT-1', icon: '🚇' },
              { key: 'lrt2', label: '🚇 LRT-2', icon: '🚇' },
              { key: 'mrt3', label: '🚇 MRT-3', icon: '🚇' },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => { setMode(m.key as any); setFromStation(''); setToStation(''); }}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition ${
                  mode === m.key
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-500 dark:text-emerald-300'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
            {mode === 'jeepney' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Distance (km)</label>
                  <input type="number" value={km} onChange={e => setKm(e.target.value)} placeholder="e.g. 5" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={isStudent} onChange={e => setIsStudent(e.target.checked)} className="rounded" />
                    <span className="text-gray-700 dark:text-gray-300">Student (20% off)</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={isSenior} onChange={e => setIsSenior(e.target.checked)} className="rounded" />
                    <span className="text-gray-700 dark:text-gray-300">Senior (20% off)</span>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Station</label>
                    <select value={fromStation} onChange={e => setFromStation(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                      <option value="">Select</option>
                      {stations.map((s: Station) => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Station</label>
                    <select value={toStation} onChange={e => setToStation(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                      <option value="">Select</option>
                      {stations.map((s: Station) => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={isStudent} onChange={e => setIsStudent(e.target.checked)} className="rounded" />
                    <span className="text-gray-700 dark:text-gray-300">Student/Senior (50% off)</span>
                  </label>
                </div>
                {mode !== 'lrt1' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2 text-xs text-blue-700 dark:text-blue-400">
                    ℹ️ LRT-2 and MRT-3 have 50% across-the-board discount effective March 23, 2026
                  </div>
                )}
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trips per day</label>
                <input type="number" value={tripsPerDay} onChange={e => setTripsPerDay(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Days per month</label>
                <input type="number" value={daysPerMonth} onChange={e => setDaysPerMonth(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
              </div>
            </div>
          </div>

          {result && (
            <>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                <p className="text-sm opacity-90 mb-1">One-Way Fare</p>
                <p className="text-4xl font-bold">₱{result.fare}</p>
                {'discount' in result && (result as any).discount > 0 && (
                  <p className="text-sm opacity-80 mt-1">You save ₱{(result as any).discount.toFixed(2)} with {isStudent ? 'student' : 'senior'} discount</p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/15 rounded-lg px-3 py-2">
                    <p className="opacity-80">Daily ({tripsPerDay} trips)</p>
                    <p className="font-semibold">₱{result.daily.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/15 rounded-lg px-3 py-2">
                    <p className="opacity-80">Monthly ({daysPerMonth} days)</p>
                    <p className="font-semibold">₱{result.monthly.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {mode === 'jeepney' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fare Breakdown</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Minimum fare: ₱{(result as any).minimum} (first km)</p>
                    <p>Per km after first: ₱{(result as any).perKm}</p>
                    {'discount' in result && (result as any).discount > 0 && <p>Discount: -₱{(result as any).discount.toFixed(2)} (20%)</p>}
                    <p className="font-medium text-gray-900 dark:text-white">= ₱{result.fare} one-way</p>
                  </div>
                </div>
              )}

              {mode !== 'jeepney' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Annual Cost</h3>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₱{(result.monthly * 12).toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">Based on {daysPerMonth} days/month, {tripsPerDay} trips/day</p>
                </div>
              )}

              {monthlySavingsVsJeepney !== null && monthlySavingsVsJeepney !== 0 && (
                <div className={`rounded-xl p-4 text-sm ${monthlySavingsVsJeepney < 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'}`}>
                  {monthlySavingsVsJeepney < 0
                    ? `✅ You save ₱${Math.abs(monthlySavingsVsJeepney).toLocaleString()}/month vs jeepney`
                    : `⚠️ This costs ₱${monthlySavingsVsJeepney.toLocaleString()}/month more than jeepney`
                  }
                </div>
              )}
            </>
          )}

          {/* Fare Matrix Reference */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">📋 2026 Fare Reference</h3>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>🚎 <strong>Jeepney (Traditional):</strong> ₱14 min + ₱2/km</p>
              <p>🚎 <strong>Jeepney (Modern):</strong> ₱17 min + ₱2.40/km</p>
              <p>🚇 <strong>LRT-1:</strong> ₱15-₱25 (3 zones)</p>
              <p>🚇 <strong>LRT-2:</strong> ₱15-₱35 + 50% discount (effective Mar 23, 2026)</p>
              <p>🚇 <strong>MRT-3:</strong> ₱13-₱28 + 50% discount (effective Mar 23, 2026)</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-600 italic">
            Fare data as of March 2026 DOTr/LTFRB advisory. Actual fares may vary.
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
