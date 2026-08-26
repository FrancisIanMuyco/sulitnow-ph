import { useState, useEffect } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

interface MayaData {
  lastUpdated: string;
  source: string;
  sendMoney: {
    mayaToMaya: { fee: number; note: string };
    mayaToOtherEwallet: { fee: number; note: string };
    mayaToBank: { fee: number; note: string };
  };
  cashIn: {
    bankTransfer: { fee: number; note: string };
    overTheCounter: { fee: number; note: string };
    debitCard: { fee: number; note: string };
    creditCard: { fee: number; note: string };
  };
  cashOut: {
    bankTransfer: { fee: number; note: string };
    overTheCounter: { fee: string; note: string };
    atm: { fee: number; note: string };
  };
  billsPayment: { fee: number; note: string };
}

const transferTypes = [
  { value: 'maya' as const, label: 'Maya → Maya' },
  { value: 'bank' as const, label: 'Bank Transfer' },
  { value: 'gcash' as const, label: 'Maya → GCash' },
  { value: 'cashout' as const, label: 'ATM Cash-out' },
];

export default function MayaFeeCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'maya-fee-calculator')!;
  const [data, setData] = useState<MayaData | null>(null);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'maya' | 'bank' | 'gcash' | 'cashout'>('bank');
  const [result, setResult] = useState<{ amount: number; fee: number; total: number; note: string } | null>(null);

  useEffect(() => {
    fetch('/data/maya-fees.json').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const handleCalculate = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || !data) return;
    let fee = 0;
    let note = '';
    if (type === 'maya') { fee = data.sendMoney.mayaToMaya.fee; note = data.sendMoney.mayaToMaya.note; }
    else if (type === 'bank') { fee = data.sendMoney.mayaToBank.fee; note = data.sendMoney.mayaToBank.note; }
    else if (type === 'gcash') { fee = data.sendMoney.mayaToOtherEwallet.fee; note = data.sendMoney.mayaToOtherEwallet.note; }
    else { fee = data.cashOut.atm.fee; note = data.cashOut.atm.note; }
    setResult({ amount: num, fee, total: num + fee, note });
  };

  return (
    <ToolLayout tool={tool} recommendation={result ? `Fee: ${formatPeso(result.fee)}. Total: ${formatPeso(result.total)}.` : undefined}>
      <div className="px-4 py-4 space-y-4">
        {data && (
          <div className="bg-surface-alt rounded-xl p-3 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-text">💜 Maya Fee Schedule</p>
              <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <p className="text-[9px] text-text-muted mb-2">Source: {data.source}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                ['Maya → Maya', `${formatPeso(data.sendMoney.mayaToMaya.fee)}`, data.sendMoney.mayaToMaya.note],
                ['Maya → Bank', `${formatPeso(data.sendMoney.mayaToBank.fee)}`, data.sendMoney.mayaToBank.note],
                ['Maya → E-Wallet', `${formatPeso(data.sendMoney.mayaToOtherEwallet.fee)}`, data.sendMoney.mayaToOtherEwallet.note],
                ['ATM Cash-out', `${formatPeso(data.cashOut.atm.fee)}`, data.cashOut.atm.note],
                ['Bills Payment', `${formatPeso(data.billsPayment.fee)}`, data.billsPayment.note],
                ['Cash-in (Bank)', `${formatPeso(data.cashIn.bankTransfer.fee)}`, data.cashIn.bankTransfer.note],
              ].map(([type2, fee, note]) => (
                <div key={type2} className="bg-surface rounded-lg p-2 text-center">
                  <p className="text-[9px] text-text-muted">{type2}</p>
                  <p className={`text-sm font-bold ${fee === '₱0.00' ? 'text-green-600' : 'text-text'}`}>{fee}</p>
                  <p className="text-[8px] text-text-muted">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Input label="Amount" prefix="₱" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000" />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">Transfer Type</label>
          <div className="grid grid-cols-2 gap-2">
            {transferTypes.map((t) => (
              <button key={t.value} onClick={() => setType(t.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${type === t.value ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary hover:bg-border'}`}>
                {t.label}
              </button>
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
          <p className="text-[10px] text-text-muted text-center">{result.note}</p>
        </div>
      )}
    </ToolLayout>
  );
}
