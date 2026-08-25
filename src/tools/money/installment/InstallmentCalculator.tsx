import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso, formatNumber } from '../../../utils/format';

export default function InstallmentCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'installment-calculator')!;
  const [cashPrice, setCashPrice] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState<{
    totalPayment: number;
    totalInterest: number;
    interestPercent: number;
    effectiveMonthlyRate: number;
  } | null>(null);

  const handleCalculate = () => {
    const price = parseFloat(cashPrice);
    const monthly = parseFloat(monthlyPayment);
    const n = parseInt(months);

    if (isNaN(price) || isNaN(monthly) || isNaN(n) || price <= 0 || monthly <= 0 || n <= 0) return;

    const totalPayment = monthly * n;
    const totalInterest = totalPayment - price;
    const interestPercent = (totalInterest / price) * 100;

    // Simple effective monthly rate approximation
    const effectiveMonthlyRate = ((totalPayment / price) ** (1 / n) - 1) * 100;

    setResult({ totalPayment, totalInterest, interestPercent, effectiveMonthlyRate });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `The true cost is ${formatPeso(result.totalPayment)}, which is ${formatNumber(result.interestPercent)}% more than the cash price. You'll pay ${formatPeso(result.totalInterest)} in interest.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input
          label="Cash Price"
          prefix="₱"
          type="number"
          value={cashPrice}
          onChange={(e) => setCashPrice(e.target.value)}
          placeholder="15000"
          hint="The price if you pay in cash"
        />
        <Input
          label="Monthly Payment"
          prefix="₱"
          type="number"
          value={monthlyPayment}
          onChange={(e) => setMonthlyPayment(e.target.value)}
          placeholder="1500"
        />
        <Input
          label="Number of Months"
          type="number"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          placeholder="12"
        />
        <Button onClick={handleCalculate} className="w-full">
          Calculate True Cost
        </Button>
      </div>

      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
              <p className="text-xs text-red-600 font-medium mb-1">Total Installment Cost</p>
              <p className="text-2xl font-bold text-red-600">{formatPeso(result.totalPayment)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-alt rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Extra Cost</p>
                <p className="text-sm font-bold text-red-600">{formatPeso(result.totalInterest)}</p>
              </div>
              <div className="bg-surface-alt rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Interest Rate</p>
                <p className="text-sm font-bold text-red-600">{formatNumber(result.interestPercent)}%</p>
              </div>
            </div>

            <div className="bg-surface-alt rounded-xl p-3 text-center">
              <p className="text-[10px] text-text-muted mb-0.5">Effective Monthly Rate</p>
              <p className="text-sm font-bold text-text">{formatNumber(result.effectiveMonthlyRate)}%/month</p>
            </div>

            <p className="text-xs text-text-secondary text-center">
              💡 Consider paying cash if you can — you&apos;ll save {formatPeso(result.totalInterest)}
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
