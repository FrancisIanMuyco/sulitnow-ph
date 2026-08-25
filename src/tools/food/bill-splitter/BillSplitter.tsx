import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

export default function BillSplitter() {
  const tool = toolRegistry.find((t) => t.id === 'bill-splitter')!;
  const [totalBill, setTotalBill] = useState('');
  const [people, setPeople] = useState('');
  const [tipPercent, setTipPercent] = useState('');
  const [result, setResult] = useState<{
    perPerson: number;
    totalWithTip: number;
    tipAmount: number;
  } | null>(null);

  const handleCalculate = () => {
    const bill = parseFloat(totalBill);
    const num = parseInt(people);
    const tip = parseFloat(tipPercent) || 0;

    if (isNaN(bill) || isNaN(num) || bill <= 0 || num <= 0) return;

    const tipAmount = bill * (tip / 100);
    const totalWithTip = bill + tipAmount;
    const perPerson = totalWithTip / num;

    setResult({ perPerson, totalWithTip, tipAmount });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `Each person pays ${formatPeso(result.perPerson)}.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input label="Total Bill" prefix="₱" type="number" value={totalBill} onChange={(e) => setTotalBill(e.target.value)} placeholder="1500" />
        <Input label="Number of People" type="number" value={people} onChange={(e) => setPeople(e.target.value)} placeholder="4" />
        <Input label="Tip (%)" type="number" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} placeholder="10" hint="Optional: e.g. 10 for 10% tip" />
        <Button onClick={handleCalculate} className="w-full">Split Bill</Button>
      </div>
      {result && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-primary font-medium mb-1">Each Person Pays</p>
            <p className="text-2xl font-bold text-primary">{formatPeso(result.perPerson)}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Original Bill</span><span className="font-medium text-text">{formatPeso(parseFloat(totalBill))}</span></div>
            {result.tipAmount > 0 && <div className="flex justify-between text-sm"><span className="text-text-secondary">Tip ({tipPercent}%)</span><span className="text-text">+{formatPeso(result.tipAmount)}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-text-secondary">Total with Tip</span><span className="font-medium text-text">{formatPeso(result.totalWithTip)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-secondary">People</span><span className="font-medium text-text">{people}</span></div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
