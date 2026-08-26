import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

function calculateRetirement(data: {
  currentAge: number;
  retireAge: number;
  monthlyExpenses: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  inflationRate: number;
}) {
  const yearsToRetire = data.retireAge - data.currentAge;
  const monthsToRetire = yearsToRetire * 12;
  const retireYears = 85 - data.retireAge; // assume live to 85
  const monthsInRetirement = retireYears * 12;

  // Adjusted for inflation
  const realReturn = ((1 + data.annualReturn / 100) / (1 + data.inflationRate / 100) - 1) * 100;
  const monthlyReturn = realReturn / 100 / 12;

  // Future monthly expenses (inflation-adjusted)
  const futureMonthlyExpenses = data.monthlyExpenses * Math.pow(1 + data.inflationRate / 100, yearsToRetire);

  // How much needed at retirement (annuity)
  let nestEggNeeded: number;
  if (monthlyReturn === 0) {
    nestEggNeeded = futureMonthlyExpenses * retireYears * 12;
  } else {
    nestEggNeeded = futureMonthlyExpenses * ((1 - Math.pow(1 + monthlyReturn, -monthsInRetirement)) / monthlyReturn);
  }

  // Future value of current savings
  const savingsFV = data.currentSavings * Math.pow(1 + data.annualReturn / 100, yearsToRetire);

  // Future value of monthly contributions
  let contributionsFV: number;
  if (monthlyReturn === 0) {
    contributionsFV = data.monthlyContribution * monthsToRetire;
  } else {
    contributionsFV = data.monthlyContribution * ((Math.pow(1 + monthlyReturn, monthsToRetire) - 1) / monthlyReturn);
  }

  const totalProjected = savingsFV + contributionsFV;
  const gap = nestEggNeeded - totalProjected;
  const funded = Math.min(100, (totalProjected / nestEggNeeded) * 100);

  // Required monthly contribution to hit target
  let requiredMonthly: number;
  if (gap > 0 && monthlyReturn > 0) {
    requiredMonthly = gap / ((Math.pow(1 + monthlyReturn, monthsToRetire) - 1) / monthlyReturn);
  } else if (gap > 0) {
    requiredMonthly = gap / monthsToRetire;
  } else {
    requiredMonthly = data.monthlyContribution;
  }

  return {
    yearsToRetire,
    futureMonthlyExpenses,
    nestEggNeeded,
    savingsFV,
    contributionsFV,
    totalProjected,
    gap,
    funded,
    requiredMonthly,
  };
}

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retireAge, setRetireAge] = useState('60');
  const [monthlyExpenses, setMonthlyExpenses] = useState('25000');
  const [currentSavings, setCurrentSavings] = useState('100000');
  const [monthlyContribution, setMonthlyContribution] = useState('5000');
  const [annualReturn, setAnnualReturn] = useState('6');
  const [inflationRate, setInflationRate] = useState('4');
  const [result, setResult] = useState<ReturnType<typeof calculateRetirement> | null>(null);

  const handleCalculate = () => {
    setResult(calculateRetirement({
      currentAge: parseInt(currentAge) || 25,
      retireAge: parseInt(retireAge) || 60,
      monthlyExpenses: parseFloat(monthlyExpenses) || 20000,
      currentSavings: parseFloat(currentSavings) || 0,
      monthlyContribution: parseFloat(monthlyContribution) || 0,
      annualReturn: parseFloat(annualReturn) || 6,
      inflationRate: parseFloat(inflationRate) || 4,
    }));
  };

  return (
    <ToolLayout
      tool={{ id: 'retirement-calculator', name: 'Retirement Calculator', slug: 'retirement-calculator', description: 'Plan when you can retire and how much you need to save', category: 'money', keywords: ['retirement', 'retire', 'pension', 'savings', 'future'], icon: 'Sunset', status: 'active', path: '/tools/retirement-calculator', requiresApi: false }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Current Age</label>
            <input type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} min="15" max="70"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Retire At Age</label>
            <input type="number" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} min="30" max="80"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Current Monthly Expenses (₱)</label>
          <input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} min="5000"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Current Savings (₱)</label>
            <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} min="0"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Savings (₱)</label>
            <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} min="0"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Expected Return (%/yr)</label>
            <input type="number" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} step="0.5" min="0" max="30"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inflation Rate (%/yr)</label>
            <input type="number" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} step="0.5" min="0" max="20"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Calculate Retirement
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Funded percentage */}
          <div className={`rounded-xl p-6 text-center ${
            result.funded >= 100
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
          }`}>
            <p className="text-sm text-gray-500 mb-1">Retirement Fund Status</p>
            <p className={`text-4xl font-bold ${result.funded >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
              {result.funded.toFixed(0)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {result.funded >= 100
                ? `✅ On track to retire at ${parseInt(retireAge)}!`
                : `Gap: ₱${result.gap.toLocaleString(undefined, { maximumFractionDigits: 0 })} needed`
              }
            </p>
          </div>

          {/* Key numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Nest Egg Needed</p>
              <p className="text-lg font-bold text-primary">₱{result.nestEggNeeded.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Projected Savings</p>
              <p className="text-lg font-bold">₱{result.totalProjected.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          {/* Required savings */}
          {result.gap > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
              <p className="text-xs text-red-500 mb-1">Monthly savings needed to hit target</p>
              <p className="text-2xl font-bold text-red-600">₱{result.requiredMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}/month</p>
              <p className="text-xs text-gray-400 mt-1">That's ₱{(result.requiredMonthly - parseFloat(monthlyContribution) || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} more than current ₱{parseFloat(monthlyContribution).toLocaleString()}/month</p>
            </div>
          )}

          {/* Breakdown */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm">Projection Breakdown</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm">📅 Years to retirement</span>
                <span className="font-semibold">{result.yearsToRetire} years</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm">💰 Future monthly expenses</span>
                <span className="font-semibold">₱{result.futureMonthlyExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm">🏦 From current savings growth</span>
                <span className="font-semibold">₱{result.savingsFV.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm">📈 From monthly contributions</span>
                <span className="font-semibold">₱{result.contributionsFV.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
