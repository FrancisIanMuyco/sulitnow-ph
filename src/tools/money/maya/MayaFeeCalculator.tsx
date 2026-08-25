import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

const MAYA_FEES = {
  sendToMaya: { fee: 0, note: 'Free for Maya-to-Maya transfers' },
  bankTransfer: { rates: [
    { min: 0, max: 1000, fee: 15 },
    { min: 1000, max: 5000, fee: 25 },
    { min: 5000, max: 10000, fee: 30 },
    { min: 10000, max: 50000, fee: 50 },
    { min: 50000, max: Infinity, fee: 75 },
  ]},
  cashOut: { rates: [
    { min: 0, max: 1000, fee: 15 },
    { min: 1000, max: 5000, fee: 25 },
    { min: 5000, max: 10000, fee: 30 },
    { min: 10000, max: 50000, fee: 50 },
    { min: 50000, max: Infinity, fee: 75 },
  ]},
};

function getFee(amount: number, rates: typeof MAYA_FEES.bankTransfer.rates): number {
  const bracket = rates.find((r) => amount >= r.min && amount < r.max);
  return bracket?.fee || 75;
}

export default function MayaFeeCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'maya-fee-calculator')!;
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'maya' | 'bank' | 'cashout'>('bank');
  const [result, setResult] = useState<{ amount: number; fee: number; total: number; note: string } | null>(null);

  const handleCalculate = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    let fee = 0;
    let note = '';
    if (type === 'maya') { fee = 0; note = 'Free Maya-to-Maya'; }
    else if (type === 'bank') { fee = getFee(num, MAYA_FEES.bankTransfer.rates); note = 'Bank transfer fee'; }
    else { fee = getFee(num, MAYA_FEES.cashOut.rates); note = 'Cash-out fee'; }
    setResult({ amount: num, fee, total: num + fee, note });
  };

  return (
    <ToolLayout tool={tool} recommendation={result ? `Fee: ${formatPeso(result.fee)}. Total: ${formatPeso(result.total)}.` : undefined}>
      <div className="px-4 py-4 space-y-4">
        <Input label="Amount" prefix="₱" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000" />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">Transfer Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ value: 'maya' as const, label: 'Maya to Maya' }, { value: 'bank' as const, label: 'Bank Transfer' }, { value: 'cashout' as const, label: 'Cash Out' }].map((t) => (
              <button key={t.value} onClick={() => setType(t.value)} className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors ${type === t.value ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary hover:bg-border'}`}>{t.label}</button>
            ))}
          </div>
        </div>
        <Button onClick={handleCalculate} className="w-full">Calculate Fee</Button>
      </div>
      {result && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-center">
            <p className="text-xs text-accent font-medium mb-1">Maya Fee</p>
            <p className="text-2xl font-bold text-accent">{formatPeso(result.fee)}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Amount</span><span className="font-medium text-text">{formatPeso(result.amount)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Fee</span><span className="text-red-600">+{formatPeso(result.fee)}</span></div>
            <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold"><span className="text-text">Total</span><span className="text-primary">{formatPeso(result.total)}</span></div>
          </div>
          <p className="text-[10px] text-text-muted text-center">{result.note} · ⚠️ Fees are approximate</p>
        </div>
      )}
    </ToolLayout>
  );
}
