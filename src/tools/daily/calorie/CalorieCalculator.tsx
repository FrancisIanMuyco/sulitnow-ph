import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary', desc: 'Desk job, little exercise' },
  { value: 1.375, label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { value: 1.55, label: 'Moderately Active', desc: 'Exercise 3-5 days/week' },
  { value: 1.725, label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  { value: 1.9, label: 'Extra Active', desc: 'Athlete / physical job' },
];

const GOALS = [
  { value: -500, label: 'Lose Weight', desc: '~0.5 kg/week', color: 'text-red-500' },
  { value: -250, label: 'Slow Loss', desc: '~0.25 kg/week', color: 'text-orange-500' },
  { value: 0, label: 'Maintain', desc: 'Stay current weight', color: 'text-green-500' },
  { value: 250, label: 'Slow Gain', desc: '~0.25 kg/week', color: 'text-blue-500' },
  { value: 500, label: 'Gain Weight', desc: '~0.5 kg/week', color: 'text-purple-500' },
];

function calculate(age: number, weight: number, height: number, gender: 'male' | 'female', activity: number) {
  // Mifflin-St Jeor
  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * activity;

  return { bmr, tdee };
}

function getMacros(calories: number, goal: number) {
  const target = calories + goal;
  const protein = Math.round(target * 0.30 / 4); // 30% protein, 4 cal/g
  const carbs = Math.round(target * 0.40 / 4); // 40% carbs
  const fat = Math.round(target * 0.30 / 9); // 30% fat
  return { target, protein, carbs, fat };
}

export default function CalorieCalculator() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState(1.2);
  const [goal, setGoal] = useState(0);
  const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null);

  const handleCalculate = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!a || !w || !h || a < 10 || a > 120 || w < 20 || h < 100) return;
    setResult(calculate(a, w, h, gender, activity));
  };

  const macros = result ? getMacros(result.tdee, goal) : null;

  return (
    <ToolLayout
      tool={{ id: 'calorie-calculator', name: 'Calorie & Macro Calculator', slug: 'calorie-calculator', description: 'Calculate your daily calorie needs and macro breakdown', category: 'daily', keywords: ['calorie', 'macro', 'protein', 'carbs', 'fat', 'diet'], icon: 'Flame', status: 'active', path: '/tools/calorie-calculator', requiresApi: false }}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" min="10" max="120"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <div className="flex gap-1">
              {(['male', 'female'] as const).map((g) => (
                <button key={g} onClick={() => setGender(g)}
                  className={`flex-1 py-3 rounded-lg border text-xs font-medium transition-colors ${gender === g ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                  {g === 'male' ? '♂ Male' : '♀ Female'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="65" min="20" max="300"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" min="100" max="250"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Activity Level</label>
          <div className="space-y-1">
            {ACTIVITY_LEVELS.map((a) => (
              <button key={a.value} onClick={() => setActivity(a.value)}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg border text-sm transition-colors ${activity === a.value ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                <span className="font-medium">{a.label}</span>
                <span className="text-xs opacity-75">{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Calculate
        </button>
      </div>

      {result && macros && (
        <div className="mt-6 space-y-4">
          {/* BMR + TDEE */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 text-center">
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">BMR (Base)</p>
              <p className="text-2xl font-bold text-orange-600">{Math.round(result.bmr)}</p>
              <p className="text-xs text-gray-400">cal/day</p>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-primary mb-1">TDEE (Active)</p>
              <p className="text-2xl font-bold text-primary">{Math.round(result.tdee)}</p>
              <p className="text-xs text-gray-400">cal/day</p>
            </div>
          </div>

          {/* Goal selector */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2">🎯 Your Goal</h3>
            <div className="grid grid-cols-1 gap-1">
              {GOALS.map((g) => (
                <button key={g.value} onClick={() => setGoal(g.value)}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-colors ${goal === g.value ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''}`}>
                  <span>{g.label}</span>
                  <span className={`text-xs ${g.color}`}>{g.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target calories */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Target Daily Calories</p>
            <p className="text-4xl font-bold text-green-600">{macros.target.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">
              {goal > 0 ? `+${goal}` : goal < 0 ? goal : '±0'} cal from maintenance
            </p>
          </div>

          {/* Macros */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">📊 Daily Macros (30/40/30)</h3>
            <div className="space-y-3">
              {[
                { label: 'Protein', grams: macros.protein, cal: macros.protein * 4, pct: '30%', color: 'bg-blue-500' },
                { label: 'Carbs', grams: macros.carbs, cal: macros.carbs * 4, pct: '40%', color: 'bg-yellow-500' },
                { label: 'Fat', grams: macros.fat, cal: macros.fat * 9, pct: '30%', color: 'bg-red-500' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{m.label}</span>
                    <span className="text-gray-500">{m.grams}g · {m.cal} cal · {m.pct}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.cal / macros.target * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
