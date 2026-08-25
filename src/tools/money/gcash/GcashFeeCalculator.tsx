import { useState, useEffect } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

interface GcashData {
  lastUpdated: string;
  source: string;
  fees: {
    sendMoney: {
      gcashToGcash: { fee: number; note: string };
      gcashToBank: {
        instapay: { fee: number; note: string };
        pesonet: { fee: number; note: string };
      };
    };
    cashOut: {
      bankTransfer: { fee: number; note: string };
      atm: { fee: number; note: string };
    };
    billsPayment: { fee: number; note: string };
    buyLoad: { fee: number; note: string };
    payQR: { fee: number; note: string };
  };
  limits: {
    fullyVerified: { daily: number; monthly: number; perTransaction: number };
    partiallyVerified: { daily: number; monthly: number; perTransaction: number };
    basic: { daily: number; monthly: number; perTransaction: number };
  };
}

export default function GcashFeeCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'gcash-fee-calculator')!;
  const [data, setData] = useState<GcashData | null>(null);
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState<'gcash' | 'bank_instapay' | 'bank_pesonet' | 'cashout_atm'>('gcash');
  const [result, setResult] = useState<{ amount: number; fee: number; total: number; note: string } | null>(null);

  useEffect(() => {
    fetch('/data/gcash-fees.json').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const handleCalculate = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || !data) return;
    let fee = 0;
    let note = '';
    if (transferType === 'gcash') { fee = data.fees.sendMoney.gcashToGcash.fee; note = data.fees.sendMoney.gcashToGcash.note; }
    else if (transferType === 'bank_instapay') { fee = data.fees.sendMoney.gcashToBank.instapay.fee; note = data.fees.sendMoney.gcashToBank.instapay.note; }
    else if (transferType === 'bank_pesonet') { fee = data.fees.sendMoney.gcashToBank.pesonet.fee; note = data.fees.sendMoney.gcashToBank.pesonet.note; }
    else { fee = data.fees.cashOut.atm.fee; note = data.fees.cashOut.atm.note; }
    setResult({ amount: num, fee, total: num + fee, note });
  };

  return (
    <ToolLayout tool={tool} recommendation={result ? `Fee: ${formatPeso(result.fee)}. Recipient gets: ${formatPeso(result.amount)}. Total cost: ${formatPeso(result.total)}.` : undefined}>
      <div className="px-4 py-4 space-y-4">
        {/* Real fee info */}
        {data && (
          <div className="bg-surface-alt rounded-xl p-3 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-text">💰 GCash Fee Schedule</p>
              <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <p className="text-[9px] text-text-muted mb-2">Source: {data.source}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                ['GCash→GCash', `₱${data.fees.sendMoney.gcashToGcash.fee}`, 'Free'],
                ['Bank (Instapay)', `₱${data.fees.sendMoney.gcashToBank.instapay.fee}`, 'Instant'],
                ['Bank (Pesonet)', `₱${data.fees.sendMoney.gcashToBank.pesonet.fee}`, '1 day'],
                ['ATM Cash-out', `₱${data.fees.cashOut.atm.fee}`, 'Via Euronet'],
                ['Bills Payment', `₱${data.fees.billsPayment.fee}`, data.fees.billsPayment.note],
                ['Buy Load', `₱${data.fees.buyLoad.fee}`, data.fees.buyLoad.note],
              ].map(([type, fee, note]) => (
                <div key={type} className="bg-surface rounded-lg p-2 text-center">
                  <p className="text-[9px] text-text-muted">{type}</p>
                  <p className={`text-sm font-bold ${fee === '₱0' ? 'text-green-600' : 'text-text'}`}>{fee}</p>
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
            {[
              { value: 'gcash' as const, label: 'GCash → GCash' },
              { value: 'bank_instapay' as const, label: 'Bank (Instapay)' },
              { value: 'bank_pesonet' as const, label: 'Bank (Pesonet)' },
              { value: 'cashout_atm' as const, label: 'ATM Cash-out' },
            ].map((type) => (
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
