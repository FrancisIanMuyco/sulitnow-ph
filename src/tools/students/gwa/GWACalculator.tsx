import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Button from '../../../components/ui/Button';
import { formatNumber } from '../../../utils/format';
import { Plus, Trash2 } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  grade: string;
  units: string;
}

let nextId = 1;

export default function GWACalculator() {
  const tool = toolRegistry.find((t) => t.id === 'gwa-calculator')!;
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: nextId++, name: '', grade: '', units: '' },
    { id: nextId++, name: '', grade: '', units: '' },
  ]);
  const [result, setResult] = useState<{ gwa: number; totalUnits: number; totalWeighted: number } | null>(null);

  const addSubject = () => setSubjects([...subjects, { id: nextId++, name: '', grade: '', units: '' }]);
  const removeSubject = (id: number) => { if (subjects.length > 1) setSubjects(subjects.filter((s) => s.id !== id)); };
  const update = (id: number, field: keyof Subject, value: string) => setSubjects(subjects.map((s) => s.id === id ? { ...s, [field]: value } : s));

  const handleCalculate = () => {
    let totalWeighted = 0;
    let totalUnits = 0;
    for (const s of subjects) {
      const grade = parseFloat(s.grade);
      const units = parseFloat(s.units);
      if (isNaN(grade) || isNaN(units) || grade < 0 || grade > 100 || units <= 0) continue;
      totalWeighted += grade * units;
      totalUnits += units;
    }
    if (totalUnits === 0) return;
    const gwa = totalWeighted / totalUnits;
    setResult({ gwa, totalUnits, totalWeighted });
  };

  const getRemark = (gwa: number) => {
    if (gwa >= 95) return { text: 'With High Honors', color: 'text-green-600' };
    if (gwa >= 90) return { text: 'With Honors', color: 'text-blue-600' };
    if (gwa >= 85) return { text: "Dean's List", color: 'text-purple-600' };
    if (gwa >= 75) return { text: 'Passing', color: 'text-text-secondary' };
    return { text: 'Needs Improvement', color: 'text-red-600' };
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `Your GWA is ${formatNumber(result.gwa)}. ${getRemark(result.gwa).text}.` : undefined}
    >
      <div className="px-4 py-4 space-y-3">
        <p className="text-xs text-text-secondary">Enter your grades (0-100) and units for each subject:</p>

        {subjects.map((subject, index) => (
          <div key={subject.id} className="bg-surface-alt rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text">Subject {index + 1}</span>
              {subjects.length > 1 && (
                <button onClick={() => removeSubject(subject.id)} className="text-text-muted hover:text-red-500">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <input type="text" value={subject.name} onChange={(e) => update(subject.id, 'name', e.target.value)} placeholder="Subject name (optional)" className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white dark:bg-slate-800 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-text-muted mb-0.5">Grade (0-100)</label>
                <input type="number" min="0" max="100" value={subject.grade} onChange={(e) => update(subject.id, 'grade', e.target.value)} placeholder="95" className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-white dark:bg-slate-800 text-text focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-[10px] text-text-muted mb-0.5">Units</label>
                <input type="number" min="0" value={subject.units} onChange={(e) => update(subject.id, 'units', e.target.value)} placeholder="3" className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-white dark:bg-slate-800 text-text focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          </div>
        ))}

        <button onClick={addSubject} className="w-full flex items-center justify-center gap-1.5 text-xs text-primary hover:bg-primary/5 py-2 rounded-lg transition-colors">
          <Plus size={12} /> Add Subject
        </button>

        <Button onClick={handleCalculate} className="w-full">Calculate GWA</Button>
      </div>

      {result && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-primary font-medium mb-1">Your GWA</p>
            <p className="text-3xl font-bold text-primary">{formatNumber(result.gwa)}</p>
            <p className={`text-sm font-medium mt-1 ${getRemark(result.gwa).color}`}>{getRemark(result.gwa).text}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-alt rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted mb-0.5">Total Units</p>
              <p className="text-sm font-bold text-text">{result.totalUnits}</p>
            </div>
            <div className="bg-surface-alt rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted mb-0.5">Weighted Sum</p>
              <p className="text-sm font-bold text-text">{formatNumber(result.totalWeighted)}</p>
            </div>
          </div>
          <p className="text-[10px] text-text-muted text-center">⚠️ Based on Philippine grading scale (0-100). Check your school's specific grading system.</p>
        </div>
      )}
    </ToolLayout>
  );
}
