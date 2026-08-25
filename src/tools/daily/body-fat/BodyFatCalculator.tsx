import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');

  const h = parseFloat(height) || 0;
  const neckVal = parseFloat(neck) || 0;
  const waistVal = parseFloat(waist) || 0;
  const hipVal = parseFloat(hip) || 0;

  // US Navy method
  let bodyFat = 0;
  if (gender === 'male' && waistVal > 0 && neckVal > 0 && h > 0) {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistVal - neckVal) + 0.15456 * Math.log10(h)) - 450;
  } else if (gender === 'female' && waistVal > 0 && neckVal > 0 && hipVal > 0 && h > 0) {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistVal + hipVal - neckVal) + 0.22100 * Math.log10(h)) - 450;
  }
  bodyFat = Math.max(0, Math.min(60, bodyFat));

  const getBodyFatCategory = (bf: number, g: string) => {
    if (g === 'male') {
      if (bf <= 0) return null;
      if (bf < 6) return { label: 'Essential Fat', color: 'text-blue-500' };
      if (bf < 14) return { label: 'Athletes', color: 'text-green-500' };
      if (bf < 18) return { label: 'Fitness', color: 'text-green-400' };
      if (bf < 25) return { label: 'Average', color: 'text-yellow-500' };
      return { label: 'Above Average', color: 'text-red-500' };
    } else {
      if (bf <= 0) return null;
      if (bf < 14) return { label: 'Essential Fat', color: 'text-blue-500' };
      if (bf < 21) return { label: 'Athletes', color: 'text-green-500' };
      if (bf < 25) return { label: 'Fitness', color: 'text-green-400' };
      if (bf < 32) return { label: 'Average', color: 'text-yellow-500' };
      return { label: 'Above Average', color: 'text-red-500' };
    }
  };

  const category = getBodyFatCategory(bodyFat, gender);

  return (
    <ToolLayout
      tool={{ id: 'body-fat', name: 'Body Fat Calculator', slug: 'body-fat', description: 'Estimate body fat percentage using the US Navy method.', category: 'daily', keywords: ['body', 'fat', 'percentage', 'navy', 'health', 'fitness'], icon: 'Activity', status: 'active', path: '/tools/body-fat', requiresApi: false }}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['male', 'female'] as const).map(g => (
            <button key={g} onClick={() => setGender(g)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border ${gender === g ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>
              {g === 'male' ? '👨 Male' : '👩 Female'}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Age</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 25"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Weight (kg)</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0" step="0.1"
              className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Height (cm)</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="0"
              className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Neck Circumference (cm)</label>
          <input type="number" value={neck} onChange={e => setNeck(e.target.value)} placeholder="0" step="0.1"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Waist Circumference (cm)</label>
          <input type="number" value={waist} onChange={e => setWaist(e.target.value)} placeholder="0" step="0.1"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        {gender === 'female' && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Hip Circumference (cm)</label>
            <input type="number" value={hip} onChange={e => setHip(e.target.value)} placeholder="0" step="0.1"
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
        )}

        {bodyFat > 0 && category && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
            <p className="text-sm text-text-secondary">Body Fat Percentage</p>
            <p className="text-5xl font-bold text-primary mt-1">{bodyFat.toFixed(1)}%</p>
            <p className={`text-lg font-semibold mt-1 ${category.color}`}>{category.label}</p>
            <p className="text-xs text-text-muted mt-2">Based on US Navy method</p>
          </div>
        )}

        <div className="bg-surface-alt rounded-xl p-4 text-xs text-text-muted space-y-1">
          <p className="font-semibold text-text-secondary mb-2">How to measure:</p>
          <p>• <strong>Neck:</strong> Around the narrowest part, below the Adam's apple</p>
          <p>• <strong>Waist:</strong> At the navel level, relaxed</p>
          {gender === 'female' && <p>• <strong>Hip:</strong> Widest part of the hips/buttocks</p>}
          <p className="mt-2 italic">This is an estimate. For accurate results, consult a fitness professional.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
