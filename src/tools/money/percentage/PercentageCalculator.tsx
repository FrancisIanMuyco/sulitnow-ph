import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatNumber } from '../../../utils/format';

type Mode = 'of' | 'is-what-percent' | 'increase' | 'decrease';

const modes: { value: Mode; label: string; hint: string }[] = [
  { value: 'of', label: 'X% of Y', hint: 'What is 20% of 1000?' },
  { value: 'is-what-percent', label: 'X is what % of Y', hint: '50 is what % of 200?' },
  { value: 'increase', label: 'Increase by %', hint: 'Increase 1000 by 20%' },
  { value: 'decrease', label: 'Decrease by %', hint: 'Decrease 1000 by 20%' },
];

export default function PercentageCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'percentage-calculator')!;
  const [mode, setMode] = useState<Mode>('of');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState<{ answer: string; explanation: string } | null>(null);

  const handleCalculate = () => {
    const a = parseFloat(val1);
    const b = parseFloat(val2);
    if (isNaN(a) || isNaN(b)) return;

    let answer = 0;
    let explanation = '';

    switch (mode) {
      case 'of':
        answer = (a / 100) * b;
        explanation = `${a}% of ${formatNumber(b)} = ${formatNumber(answer)}`;
        break;
      case 'is-what-percent':
        answer = (a / b) * 100;
        explanation = `${formatNumber(a)} is ${formatNumber(answer)}% of ${formatNumber(b)}`;
        break;
      case 'increase':
        answer = a * (1 + b / 100);
        explanation = `${formatNumber(a)} increased by ${b}% = ${formatNumber(answer)}`;
        break;
      case 'decrease':
        answer = a * (1 - b / 100);
        explanation = `${formatNumber(a)} decreased by ${b}% = ${formatNumber(answer)}`;
        break;
    }

    setResult({ answer: formatNumber(answer), explanation });
  };

  return (
    <ToolLayout tool={tool}>
      <div className="px-4 py-4 space-y-4">
        {/* Mode selector */}
        <div className="grid grid-cols-2 gap-2">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => { setMode(m.value); setResult(null); }}
              className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                mode === m.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-alt text-text-secondary hover:bg-border'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-text-muted text-center">
          {modes.find((m) => m.value === mode)?.hint}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={mode === 'is-what-percent' ? 'Value' : mode === 'of' ? 'Percentage' : 'Amount'}
            type="number"
            value={val1}
            onChange={(e) => setVal1(e.target.value)}
            placeholder={mode === 'of' ? '20' : '1000'}
          />
          <Input
            label={mode === 'is-what-percent' ? 'Total' : mode === 'of' ? 'Amount' : 'Percentage (%)'}
            type="number"
            value={val2}
            onChange={(e) => setVal2(e.target.value)}
            placeholder={mode === 'of' ? '1000' : '20'}
          />
        </div>

        <Button onClick={handleCalculate} className="w-full">
          Calculate
        </Button>
      </div>

      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{result.answer}</p>
              <p className="text-xs text-text-secondary mt-2">{result.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
