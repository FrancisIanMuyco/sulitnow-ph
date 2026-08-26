import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

function calculate(heightCm: number, gender: 'male' | 'female') {
  // Devine formula
  const devine = gender === 'male'
    ? 50 + 2.3 * ((heightCm / 2.54) - 60)
    : 45.5 + 2.3 * ((heightCm / 2.54) - 60);

  // Hamwi formula
  const hamwi = gender === 'male'
    ? 48.0 + 2.7 * ((heightCm / 2.54) - 60)
    : 45.5 + 2.2 * ((heightCm / 2.54) - 60);

  // Miller formula
  const miller = gender === 'male'
    ? 56.2 + 1.41 * ((heightCm / 2.54) - 60)
    : 53.1 + 1.36 * ((heightCm / 2.54) - 60);

  // Robinson formula
  const robinson = gender === 'male'
    ? 52 + 1.9 * ((heightCm / 2.54) - 60)
    : 49 + 1.7 * ((heightCm / 2.54) - 60);

  // BMI range (healthy weight)
  const bmiLow = 18.5 * (heightCm / 100) ** 2;
  const bmiHigh = 24.9 * (heightCm / 100) ** 2;

  const avg = (devine + hamwi + miller + robinson) / 4;
  const heightFt = Math.floor(heightCm / 30.48);
  const heightIn = Math.round((heightCm / 2.54) % 12);

  return {
    devine, hamwi, miller, robinson, avg,
    bmiLow, bmiHigh,
    heightFt, heightIn,
  };
}

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<ReturnType<typeof calculate> | null>(null);

  const handleCalculate = () => {
    const h = parseFloat(height);
    if (!h || h < 50 || h > 300) return;
    setResult(calculate(h, gender));
  };

  return (
    <ToolLayout
      tool={{ id: 'ideal-weight-calculator', name: 'Ideal Weight Calculator', slug: 'ideal-weight', description: 'Find your ideal body weight using multiple proven formulas', category: 'daily', keywords: ['ideal', 'weight', 'body', 'health', 'bmi'], icon: 'Scale', status: 'active', path: '/tools/ideal-weight', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <div className="flex gap-2">
            {(['male', 'female'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  gender === g
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                }`}
              >
                {g === 'male' ? '♂ Male' : '♀ Female'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 170"
            min="50"
            max="300"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          {height && parseFloat(height) > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              ≈ {result?.heightFt || Math.floor(parseFloat(height) / 30.48)}' {result?.heightIn || Math.round((parseFloat(height) / 2.54) % 12)}"
            </p>
          )}
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Calculate Ideal Weight
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Average */}
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Ideal Weight</p>
            <p className="text-4xl font-bold text-primary">{result.avg.toFixed(1)} kg</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              BMI healthy range: {result.bmiLow.toFixed(0)} – {result.bmiHigh.toFixed(0)} kg
            </p>
          </div>

          {/* Formulas */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm">By Formula</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {[
                { name: 'Devine (1974)', val: result.devine },
                { name: 'Hamwi (1964)', val: result.hamwi },
                { name: 'Robinson (1983)', val: result.robinson },
                { name: 'Miller (1983)', val: result.miller },
              ].map((f) => (
                <div key={f.name} className="flex justify-between items-center px-4 py-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{f.name}</span>
                  <span className="font-semibold">{f.val.toFixed(1)} kg</span>
                </div>
              ))}
            </div>
          </div>

          {/* Range visual */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">📊 Healthy Weight Range</h3>
            <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-green-400 dark:bg-green-600 rounded-full"
                style={{
                  left: `${(result.bmiLow / 150) * 100}%`,
                  width: `${((result.bmiHigh - result.bmiLow) / 150) * 100}%`,
                }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-red-500"
                style={{ left: `${(result.avg / 150) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 kg</span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                {result.bmiLow.toFixed(0)} – {result.bmiHigh.toFixed(0)} kg
              </span>
              <span>150 kg</span>
            </div>
          </div>

          {/* Note */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-700 dark:text-yellow-300">
            <p className="font-medium mb-1">⚠️ Disclaimer</p>
            <p>These are general estimates. Ideal weight varies based on body composition, muscle mass, age, and overall health. Consult a healthcare professional for personalized advice.</p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
