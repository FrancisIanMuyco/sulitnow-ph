import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso } from '../../../utils/format';

export default function LoanCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'loan-calculator')!;
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState<{
    monthly: number;
    totalPayment: number;
    totalInterest: number;
    schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
  } | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12; // monthly rate
    const n = parseInt(months);

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) return;

    // Amortization formula
    const monthly = r > 0
      ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : p / n;

    const totalPayment = monthly * n;
    const totalInterest = totalPayment - p;

    // Generate schedule (first 12 months + last 3)
    const schedule = [];
    let balance = p;

    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * r;
      const principalPayment = monthly - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        month: i,
        payment: monthly,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      });
    }

    setResult({ monthly, totalPayment, totalInterest, schedule });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `Your monthly payment is ${formatPeso(result.monthly)}. Total interest paid: ${formatPeso(result.totalInterest)}.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input
          label="Loan Amount"
          prefix="₱"
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="100000"
        />
        <Input
          label="Annual Interest Rate (%)"
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="12"
          hint="e.g. 12 for 12% per year"
        />
        <Input
          label="Loan Term (months)"
          type="number"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          placeholder="12"
        />
        <Button onClick={handleCalculate} className="w-full">
          Calculate Loan
        </Button>
      </div>

      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-primary font-medium mb-1">Monthly Payment</p>
              <p className="text-2xl font-bold text-primary">{formatPeso(result.monthly)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-alt rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Total Payment</p>
                <p className="text-sm font-bold text-text">{formatPeso(result.totalPayment)}</p>
              </div>
              <div className="bg-surface-alt rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-muted mb-0.5">Total Interest</p>
                <p className="text-sm font-bold text-red-600">{formatPeso(result.totalInterest)}</p>
              </div>
            </div>

            {/* Amortization Schedule */}
            <div>
              <h4 className="text-xs font-semibold text-text mb-2">Amortization Schedule</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-1.5 text-text-muted font-medium">Month</th>
                      <th className="text-right py-1.5 text-text-muted font-medium">Payment</th>
                      <th className="text-right py-1.5 text-text-muted font-medium">Principal</th>
                      <th className="text-right py-1.5 text-text-muted font-medium">Interest</th>
                      <th className="text-right py-1.5 text-text-muted font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.slice(0, 12).map((row) => (
                      <tr key={row.month} className="border-b border-border/50">
                        <td className="py-1.5 text-text">{row.month}</td>
                        <td className="py-1.5 text-right text-text">{formatPeso(row.payment)}</td>
                        <td className="py-1.5 text-right text-green-600">{formatPeso(row.principal)}</td>
                        <td className="py-1.5 text-right text-red-600">{formatPeso(row.interest)}</td>
                        <td className="py-1.5 text-right text-text-secondary">{formatPeso(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.schedule.length > 12 && (
                  <p className="text-[10px] text-text-muted text-center mt-2">
                    Showing first 12 of {result.schedule.length} months
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
