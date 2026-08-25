import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

interface SSSRow { salaryFrom: number; salaryTo: number | null; employeeShare: number; employerShare: number; totalContribution: number; }
interface PhilHealthRow { monthlyBasicSalary: number; totalContribution: number; employeeShare: number; employerShare: number; }
interface TaxRow { monthlyFrom: number; monthlyTo: number | null; taxRate: number; excessOver: number; fixedAmount: number; }

export default function TakeHomePayCalculator() {
  const [salary, setSalary] = useState('');
  const [sssData, setSssData] = useState<SSSRow[]>([]);
  const [philhealthData, setPhilhealthData] = useState<PhilHealthRow[]>([]);
  const [taxData, setTaxData] = useState<TaxRow[]>([]);
  const [pagibigRate] = useState(0.02);
  const [pagibigMax] = useState(200);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/sss-contributions.json').then(r => r.json()),
      fetch('/data/philhealth-contributions.json').then(r => r.json()),
      fetch('/data/bir-tax-table.json').then(r => r.json()),
    ]).then(([sss, phil, tax]) => {
      setSssData(sss.table || []);
      setPhilhealthData(phil.table || []);
      setTaxData(tax.table || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const gross = parseFloat(salary) || 0;

  const findSSS = (s: number) => {
    for (const row of sssData) {
      if (s >= row.salaryFrom && (row.salaryTo === null || s <= row.salaryTo)) return row;
    }
    return sssData.length ? sssData[sssData.length - 1] : null;
  };

  const findPhilHealth = (s: number) => {
    const clamped = Math.min(Math.max(s, 10000), 100000);
    for (const row of philhealthData) {
      if (clamped <= row.monthlyBasicSalary) return row;
    }
    return philhealthData.length ? philhealthData[philhealthData.length - 1] : null;
  };

  const calcTax = (taxable: number) => {
    for (const row of taxData) {
      if (taxable >= row.monthlyFrom && (row.monthlyTo === null || taxable <= row.monthlyTo)) {
        return Math.max(0, (taxable - row.excessOver) * row.taxRate + row.fixedAmount);
      }
    }
    return 0;
  };

  const sss = findSSS(gross);
  const phil = findPhilHealth(gross);
  const sssContrib = sss?.employeeShare || 0;
  const philContrib = phil?.employeeShare || 0;
  const pagibigContrib = Math.min(gross * pagibigRate, pagibigMax);
  const totalDeductions = sssContrib + philContrib + pagibigContrib;
  const taxableIncome = Math.max(0, gross - totalDeductions - 250000 / 12);
  const tax = calcTax(taxableIncome);
  const netPay = gross - totalDeductions - tax;
  const annualNet = netPay * 12;
  const effectiveTaxRate = gross > 0 ? ((tax / gross) * 100) : 0;

  return (
    <ToolLayout
      tool={{ id: 'take-home-pay', name: 'Take-Home Pay Calculator', slug: 'take-home-pay', description: 'Compute your net salary after SSS, PhilHealth, Pag-IBIG, and income tax deductions using 2026 Philippine tables.', category: 'money', keywords: [], icon: 'Calculator', status: 'active', path: '/tools/take-home-pay', requiresApi: false }}
    >
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Gross Salary (₱)</label>
            <input
              type="number"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              placeholder="e.g. 25000"
              className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Result */}
          {gross > 0 && (
            <>
              {/* Net Pay Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                <p className="text-sm opacity-90 mb-1">Estimated Monthly Take-Home Pay</p>
                <p className="text-4xl font-bold">₱{netPay.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/15 rounded-lg px-3 py-2">
                    <p className="opacity-80">Annual Net</p>
                    <p className="font-semibold">₱{annualNet.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-white/15 rounded-lg px-3 py-2">
                    <p className="opacity-80">Effective Tax Rate</p>
                    <p className="font-semibold">{effectiveTaxRate.toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Salary Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Gross Salary</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₱{gross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 font-medium uppercase tracking-wide pt-2">Deductions</div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      SSS Contribution
                    </span>
                    <span className="text-red-600 dark:text-red-400">-₱{sssContrib.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      PhilHealth
                    </span>
                    <span className="text-red-600 dark:text-red-400">-₱{philContrib.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Pag-IBIG (HDMF)
                    </span>
                    <span className="text-red-600 dark:text-red-400">-₱{pagibigContrib.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      Income Tax (BIR)
                    </span>
                    <span className="text-red-600 dark:text-red-400">-₱{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700 font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">Net Take-Home Pay</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg">₱{netPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Employer vs Employee */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Employer Contributions (not deducted from your salary)</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-500 dark:text-gray-400">SSS (Employer)</p>
                    <p className="font-semibold text-gray-900 dark:text-white">₱{sss?.employerShare.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-500 dark:text-gray-400">PhilHealth (Employer)</p>
                    <p className="font-semibold text-gray-900 dark:text-white">₱{phil?.employerShare.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-500 dark:text-gray-400">Pag-IBIG (Employer)</p>
                    <p className="font-semibold text-gray-900 dark:text-white">₱{Math.min(gross * pagibigRate, pagibigMax).toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-500 dark:text-gray-400">13th Month (est.)</p>
                    <p className="font-semibold text-gray-900 dark:text-white">₱{(gross).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Formula */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">How is this calculated?</h3>
                <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
                  <li>SSS: Based on the 2026 SSS contribution table (RA 11199)</li>
                  <li>PhilHealth: 5% of basic salary (floor ₱10,000, ceiling ₱100,000), split 50/50</li>
                  <li>Pag-IBIG: 2% of salary, max ₱200/month</li>
                  <li>Taxable income = Gross - SSS - PhilHealth - Pag-IBIG - ₱20,833 (annual exemption ÷ 12)</li>
                  <li>Income tax: BIR withholding tax table (TRAIN Law)</li>
                  <li>Net pay = Gross - all deductions - tax</li>
                </ol>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 dark:text-gray-600 italic">
                Disclaimer: This is an estimate based on standard withholding tax tables. Actual payroll may vary depending on employer-specific deductions (e.g., GSIS, union fees, loans). Consult your HR/payroll department for exact figures.
              </p>
            </>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
