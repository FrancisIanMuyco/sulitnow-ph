import { useState, useEffect } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

interface GcashData {
  lastUpdated: string;
  source: string;
  sendMoney: {
    gcashToGCash: { fee: number; note: string };
    gcashToOtherEwallet: { fee: number; note: string };
    gcashToBank: { fee: number; note: string };
  };
  cashIn: {
    bankTransfer: { fee: number; note: string };
    overTheCounter: { min: number; max: number; note: string };
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
  { value: 'gcash' as const, label: 'GCash → GCash' },
  { value: 'bank' as const, label: 'Bank Transfer' },
  { value: 'ewallet' as const, label: 'GCash → E-Wallet' },
  { value: 'cashout_atm' as const, label: 'ATM Cash-out' },
];

export default function GcashFeeCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'gcash-fee-calculator')!;
  const [data, setData] = useState<GcashData | null>(null);
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState<'gcash' | 'bank' | 'ewallet' | 'cashout_atm'>('gcash');
  const [result, setResult] = useState<{ amount: number; fee: number; total: number; note: string } | null>(null);

  useEffect(() => {
    fetch('/data/gcash-fees.json').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const handleCalculate = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || !data) return;
    let fee = 0;
    let note = '';
    if (transferType === 'gcash') { fee = data.sendMoney.gcashToGCash.fee; note = data.sendMoney.gcashToGCash.note; }
    else if (transferType === 'bank') { fee = data.sendMoney.gcashToBank.fee; note = data.sendMoney.gcashToBank.note; }
    else if (transferType === 'ewallet') { fee = data.sendMoney.gcashToOtherEwallet.fee; note = data.sendMoney.gcashToOtherEwallet.note; }
    else { fee = data.cashOut.atm.fee; note = data.cashOut.atm.note; }
    setResult({ amount: num, fee, total: num + fee, note });
  };

  return (
    <ToolLayout tool={tool} recommendation={result ? `Fee: ${formatPeso(result.fee)}. Recipient gets: ${formatPeso(result.amount)}. Total cost: ${formatPeso(result.total)}.` : undefined}>
      <div className="px-4 py-4 space-y-4">
        {data && (
          <div className="bg-surface-alt rounded-xl p-3 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-text">💰 GCash Fee Schedule</p>
              <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <p className="text-[9px] text-text-muted mb-2">Source: {data.source}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                ['GCash → GCash', `${formatPeso(data.sendMoney.gcashToGCash.fee)}`, data.sendMoney.gcashToGCash.note],
                ['GCash → Bank', `${formatPeso(data.sendMoney.gcashToBank.fee)}`, data.sendMoney.gcashToBank.note],
                ['GCash → E-Wallet', `${formatPeso(data.sendMoney.gcashToOtherEwallet.fee)}`, data.sendMoney.gcashToOtherEwallet.note],
                ['ATM Cash-out', `${formatPeso(data.cashOut.atm.fee)}`, data.cashOut.atm.note],
                ['Bills Payment', `${formatPeso(data.billsPayment.fee)}`, data.billsPayment.note],
                ['Cash-in (Bank)', `${formatPeso(data.cashIn.bankTransfer.fee)}`, data.cashIn.bankTransfer.note],
              ].map(([type, fee, note]) => (
                <div key={type} className="bg-surface rounded-lg p-2 text-center">
                  <p className="text-[9px] text-text-muted">{type}</p>
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
            {transferTypes.map((type) => (
              <button key={type.value} onClick={() => setTransferType(type.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${transferType === type.value ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary hover:bg-border'}`}>
                {type.label}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={handleCalculate} className="w-full">Calculate Fee</Button>
      </div>
      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-center">
              <p className="text-xs text-accent font-medium mb-1">GCash Fee</p>
              <p className="text-2xl font-bold text-accent">{formatPeso(result.fee)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Amount</span><span className="font-medium text-text">{formatPeso(result.amount)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Fee</span><span className="text-red-600">+{formatPeso(result.fee)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold"><span className="text-text">Total</span><span className="text-primary">{formatPeso(result.total)}</span></div>
            </div>
            <p className="text-[10px] text-text-muted text-center">{result.note}</p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
