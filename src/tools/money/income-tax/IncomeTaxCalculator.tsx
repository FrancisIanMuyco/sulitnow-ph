import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

// BIR TRAIN Law Tax Table (2026)
const TAX_BRACKETS = [
  { min: 0, max: 250000, rate: 0, base: 0 },
  { min: 250000, max: 400000, rate: 0.15, base: 0 },
  { min: 400000, max: 800000, rate: 0.20, base: 22500 },
  { min: 800000, max: 2000000, rate: 0.25, base: 102500 },
  { min: 2000000, max: 8000000, rate: 0.30, base: 402500 },
  { min: 8000000, max: Infinity, rate: 0.35, base: 2202500 },
];

function calculateAnnualTax(annualIncome: number) {
  for (const bracket of TAX_BRACKETS) {
    if (annualIncome <= bracket.max) {
      const taxable = annualIncome - bracket.min;
      const tax = bracket.base + taxable * bracket.rate;
      return {
        tax: Math.max(0, tax),
        effectiveRate: annualIncome > 0 ? (tax / annualIncome) * 100 : 0,
        bracket: bracket.rate * 100,
        taxableIncome: Math.max(0, taxable),
      };
    }
  }
  return { tax: 0, effectiveRate: 0, bracket: 0, taxableIncome: 0 };
}

export default function IncomeTaxCalculator() {
  const [monthlySalary, setMonthlySalary] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'semi-monthly' | 'annual'>('monthly');
  const [result, setResult] = useState<ReturnType<typeof calculateAnnualTax> & { annual: number; monthly: number; semiMonthly: number } | null>(null);

  const handleCalculate = () => {
    const val = parseFloat(monthlySalary);
    if (!val || val <= 0) return;

    let annual = val;
    if (frequency === 'monthly') annual = val * 12;
    else if (frequency === 'semi-monthly') annual = val * 24;

    const taxResult = calculateAnnualTax(annual);
    setResult({
      ...taxResult,
      annual,
      monthly: taxResult.tax / 12,
      semiMonthly: taxResult.tax / 24,
    });
  };

  return (
    <ToolLayout
      tool={{ id: 'income-tax-calculator', name: 'Income Tax Calculator (BIR TRAIN)', slug: 'income-tax', description: 'Calculate your income tax under the BIR TRAIN Law (2026)', category: 'money', keywords: ['income', 'tax', 'bir', 'train', 'withholding', 'buwis'], icon: 'FileText', status: 'active', path: '/tools/income-tax', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Salary Frequency</label>
          <div className="flex gap-2">
            {([
              { value: 'monthly', label: 'Monthly' },
              { value: 'semi-monthly', label: 'Semi-Monthly' },
              { value: 'annual', label: 'Annual' },
            ] as const).map((f) => (
              <button key={f.value} onClick={() => setFrequency(f.value)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  frequency === f.value ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Gross Salary ({frequency === 'monthly' ? 'per month' : frequency === 'semi-monthly' ? 'per half-month' : 'per year'})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₱</span>
            <input type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)}
              placeholder="e.g. 25000" min="0"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-8 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Calculate Tax
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 mb-1">Annual Income Tax</p>
            <p className="text-4xl font-bold text-primary">₱{result.tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-sm text-gray-500 mt-1">Effective rate: {result.effectiveRate.toFixed(2)}%</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Monthly Tax</p>
              <p className="text-lg font-bold">₱{result.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Semi-Monthly</p>
              <p className="text-lg font-bold">₱{result.semiMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Tax Bracket</p>
              <p className="text-lg font-bold">{result.bracket}%</p>
            </div>
          </div>

          {/* Tax table */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm">BIR TRAIN Law Tax Table (2026)</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {TAX_BRACKETS.map((b, i) => (
                <div key={i} className={`flex justify-between items-center px-4 py-2 text-sm ${
                  result.annual > b.min && result.annual <= b.max ? 'bg-primary/10 font-medium' : ''
                }`}>
                  <span className="text-gray-500">
                    ₱{b.min.toLocaleString()} – {b.max === Infinity ? '∞' : `₱${b.max.toLocaleString()}`}
                  </span>
                  <span className={`font-medium ${result.annual > b.min && result.annual <= b.max ? 'text-primary' : ''}`}>
                    {(b.rate * 100).toFixed(0)}%
                    {result.annual > b.min && result.annual <= b.max && ' ← You'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-700 dark:text-yellow-300">
            <p className="font-medium mb-1">⚠️ Disclaimer</p>
            <p>This is a simplified calculator. Actual BIR withholding may differ based on de minimis benefits, 13th month pay, and other exemptions. Consult a CPA for exact computation.</p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
