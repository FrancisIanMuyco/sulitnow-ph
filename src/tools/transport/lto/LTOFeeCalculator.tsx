import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function LTOFeeCalculator() {
  const [ltoData, setLtoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [vehicleType, setVehicleType] = useState('motorcycle');
  const [weight, setWeight] = useState('');
  const [isRenewal, setIsRenewal] = useState(false);
  const [lateDays, setLateDays] = useState('0');
  const [hasPlate, setHasPlate] = useState(true);

  useEffect(() => {
    fetch('/data/lto-fees.json')
      .then(r => r.json())
      .then(d => { setLtoData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getMVUC = () => {
    if (!ltoData) return 0;
    const mvuc = ltoData.mvuc;
    if (vehicleType === 'motorcycle') {
      const wt = parseInt(weight) || 200;
      if (wt <= 200) return mvuc.motorcycle[0]?.fee || 240;
      if (wt <= 400) return mvuc.motorcycle[1]?.fee || 300;
      if (wt <= 600) return mvuc.motorcycle[2]?.fee || 400;
      return mvuc.motorcycle[3]?.fee || 600;
    }
    const category = vehicleType === 'public' ? 'publicUtility' : 'privateCar';
    const entries = mvuc[category] || mvuc.privateCar;
    const w = parseInt(weight) || 0;
    for (const entry of entries) {
      const match = entry.weight.match(/[\d,]+/g);
      if (match) {
        const max = parseInt(match[match.length - 1].replace(/,/g, ''));
        if (w <= max) return entry.fee;
      }
    }
    return entries[entries.length - 1]?.fee || 1600;
  };

  const calculate = () => {
    if (!ltoData) return null;
    const mvuc = getMVUC();
    const fees = ltoData.otherFees;
    const regFee = isRenewal ? fees.renewalFee || fees.registrationFee : fees.registrationFee;
    const plateFee = hasPlate ? 0 : fees.plateNumber;
    const emission = vehicleType === 'motorcycle' ? fees.emissionTest.smoke : fees.emissionTest.gasoline;
    const ctpl = vehicleType === 'motorcycle' ? fees.ctplInsurance.motorcycle
      : vehicleType === 'public' ? fees.ctplInsurance.publicUtility
      : fees.ctplInsurance.privateCar;
    const stencil = fees.stencilFee;
    const inspection = fees.inspectionFee;
    const late = Math.min(parseInt(lateDays) || 0, 365) * fees.penaltyPerDay;
    const total = mvuc + regFee + plateFee + emission + ctpl + stencil + inspection + late;
    return { mvuc, regFee, plateFee, emission, ctpl, stencil, inspection, late, total };
  };

  const result = calculate();

  return (
    <ToolLayout
      tool={{ id: 'lto-fee-calculator', name: 'LTO Registration Fee Calculator', slug: 'lto-fee-calculator', description: 'Estimate your LTO vehicle registration fees in the Philippines for 2026.', category: 'daily', keywords: [], icon: 'Car', status: 'active', path: '/tools/lto-fee-calculator', requiresApi: false }}
    >
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Type</label>
              <select value={vehicleType} onChange={e => { setVehicleType(e.target.value);              setWeight(''); }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="motorcycle">🏍️ Motorcycle</option>
                <option value="private">🚗 Private Car</option>
                <option value="public">🚌 Public Utility Vehicle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {vehicleType === 'motorcycle' ? 'Engine Displacement (cc)' : 'Gross Vehicle Weight (kg)'}
              </label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                placeholder={vehicleType === 'motorcycle' ? 'e.g. 150' : 'e.g. 1200'}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isRenewal} onChange={e => setIsRenewal(e.target.checked)} className="rounded" />
              <span className="text-gray-700 dark:text-gray-300">Registration Renewal</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!hasPlate} onChange={e => setHasPlate(!e.target.checked)} className="rounded" />
              <span className="text-gray-700 dark:text-gray-300">Need new plate number</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Late registration days (0 if on time)</label>
              <input type="number" value={lateDays} onChange={e => setLateDays(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>

          {result && (
            <>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                <p className="text-sm opacity-90 mb-1">Estimated Total Cost</p>
                <p className="text-4xl font-bold">₱{result.total.toLocaleString()}</p>
                <p className="text-xs opacity-70 mt-2">Includes all standard LTO fees</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Fee Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">MVUC (Motor Vehicle User's Charge)</span><span className="font-medium text-gray-900 dark:text-white">₱{result.mvuc.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Registration Fee</span><span className="font-medium text-gray-900 dark:text-white">₱{result.regFee}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Emission Test</span><span className="font-medium text-gray-900 dark:text-white">₱{result.emission}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">CTPL Insurance</span><span className="font-medium text-gray-900 dark:text-white">₱{result.ctpl}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Inspection Fee</span><span className="font-medium text-gray-900 dark:text-white">₱{result.inspection}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Stencil Fee</span><span className="font-medium text-gray-900 dark:text-white">₱{result.stencil}</span></div>
                  {result.plateFee > 0 && <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Plate Number</span><span className="font-medium text-gray-900 dark:text-white">₱{result.plateFee}</span></div>}
                  {result.late > 0 && <div className="flex justify-between text-orange-600"><span>Late Penalty ({lateDays} days)</span><span className="font-medium">₱{result.late.toLocaleString()}</span></div>}
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg">₱{result.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-400">
                ⚠️ Late penalty: ₱50/day (max ₱2,000). Renew before your registration expires!
              </div>
            </>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-600 italic">
            Fees based on 2026 LTO schedule. Actual fees may vary. Check lto.gov.ph for latest rates.
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
