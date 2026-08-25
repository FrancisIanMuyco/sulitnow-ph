import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');

  const calculate = () => {
    let bmi = 0;
    if (unit === 'metric') {
      const w = parseFloat(weight) || 0;
      const h = parseFloat(height) || 0;
      if (w > 0 && h > 0) bmi = w / ((h / 100) ** 2);
    } else {
      const w = parseFloat(weight) || 0;
      const ft = parseFloat(heightFt) || 0;
      const inc = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inc;
      if (w > 0 && totalInches > 0) bmi = (w / (totalInches ** 2)) * 703;
    }
    return bmi;
  };

  const bmi = calculate();
  const getBMIInfo = (bmi: number) => {
    if (bmi <= 0) return { label: '', color: '', advice: '', emoji: '' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500', advice: 'Consider consulting a nutritionist for a healthy weight gain plan.', emoji: '🔵' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-500', advice: 'Great! Maintain your current lifestyle with balanced diet and exercise.', emoji: '🟢' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500', advice: 'Consider increasing physical activity and monitoring calorie intake.', emoji: '🟡' };
    if (bmi < 35) return { label: 'Obese (Class I)', color: 'text-orange-500', advice: 'Consult a healthcare provider for personalized advice.', emoji: '🟠' };
    return { label: 'Obese (Class II+)', color: 'text-red-500', advice: 'Please consult a healthcare professional for guidance.', emoji: '🔴' };
  };

  const info = getBMIInfo(bmi);

  return (
    <ToolLayout
      tool={{ id: 'bmi-calculator', name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Calculate your Body Mass Index and understand your weight category.', category: 'daily', keywords: ['bmi', 'body', 'mass', 'index', 'weight', 'health'], icon: 'Activity', status: 'active', path: '/tools/bmi-calculator', requiresApi: false }}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['metric', 'imperial'] as const).map(u => (
            <button key={u} onClick={() => setUnit(u)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border ${unit === u ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>
              {u === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lbs/ft)'}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        {unit === 'metric' ? (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Height (cm)</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="0"
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-secondary mb-1">Feet</label>
              <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="0"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-secondary mb-1">Inches</label>
              <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="0"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
          </div>
        )}

        {bmi > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
            <p className="text-sm text-text-secondary mb-1">Your BMI</p>
            <p className={`text-5xl font-bold ${info.color}`}>{bmi.toFixed(1)}</p>
            <p className={`text-lg font-semibold mt-1 ${info.color}`}>{info.emoji} {info.label}</p>
            <p className="text-sm text-text-secondary mt-3">{info.advice}</p>
          </div>
        )}

        <div className="bg-surface-alt rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-2">BMI Categories (WHO)</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-blue-500">Underweight</span><span>&lt; 18.5</span></div>
            <div className="flex justify-between"><span className="text-green-500">Normal</span><span>18.5 – 24.9</span></div>
            <div className="flex justify-between"><span className="text-yellow-500">Overweight</span><span>25.0 – 29.9</span></div>
            <div className="flex justify-between"><span className="text-orange-500">Obese (Class I)</span><span>30.0 – 34.9</span></div>
            <div className="flex justify-between"><span className="text-red-500">Obese (Class II+)</span><span>≥ 35.0</span></div>
          </div>
        </div>

        <p className="text-xs text-text-muted text-center">BMI is a general indicator. Consult a healthcare professional for personalized advice.</p>
      </div>
    </ToolLayout>
  );
}
