import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { ArrowLeftRight } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'installment-vs-cash')!;

export default function InstallmentVsCash() {
  const [cashPrice, setCashPrice] = useState('');
  const [installmentPrice, setInstallmentPrice] = useState('');
  const [months, setMonths] = useState('12');
  const [result, setResult] = useState<null | {
    cashTotal: number;
    installmentTotal: number;
    monthly: number;
    extraCost: number;
    extraPercent: number;
    recommendation: string;
  }>(null);

  const calculate = () => {
    const cash = parseFloat(cashPrice) || 0;
    const inst = parseFloat(installmentPrice) || 0;
    const m = parseInt(months) || 12;
    if (cash <= 0 || inst <= 0) return;
    const monthly = inst / m;
    const extra = inst - cash;
    const pct = cash > 0 ? (extra / cash) * 100 : 0;
    let rec = '';
    if (extra <= 0) rec = 'Mas sulit ang installment — same or cheaper lang!';
    else if (pct < 5) rec = 'Gamay lang ang extra cost. Pwede na ang installment kung need mo ug flexibility.';
    else if (pct < 15) rec = 'Moderate ang extra cost. Kung kaya mo i-cash, mas makasave ka.';
    else rec = 'Dako ang extra cost sa installment. Highly recommended mag-cash kung kaya.';
    setResult({ cashTotal: cash, installmentTotal: inst, monthly, extraCost: extra, extraPercent: pct, recommendation: rec });
  };

  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <ArrowLeftRight size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Compare Options</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Cash Price (₱)</label>
              <input type="number" value={cashPrice} onChange={e => setCashPrice(e.target.value)} placeholder="e.g. 15000" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Total Installment Price (₱)</label>
              <input type="number" value={installmentPrice} onChange={e => setInstallmentPrice(e.target.value)} placeholder="e.g. 18000" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Number of Months</label>
              <input type="number" value={months} onChange={e => setMonths(e.target.value)} min={1} max={60} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <button onClick={calculate} className="w-full mt-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition">Compare</button>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="bg-surface-alt rounded-xl p-4 border border-border">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Results</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-lg p-3 border border-border">
                  <div className="text-xs text-text-muted mb-1">💵 Cash Price</div>
                  <div className="text-lg font-bold text-text">{fmt(result.cashTotal)}</div>
                </div>
                <div className="bg-surface rounded-lg p-3 border border-border">
                  <div className="text-xs text-text-muted mb-1">📅 Installment Total</div>
                  <div className="text-lg font-bold text-text">{fmt(result.installmentTotal)}</div>
                </div>
                <div className="bg-surface rounded-lg p-3 border border-border">
                  <div className="text-xs text-text-muted mb-1">📆 Monthly Payment</div>
                  <div className="text-lg font-bold text-primary">{fmt(result.monthly)}</div>
                </div>
                <div className="bg-surface rounded-lg p-3 border border-border">
                  <div className="text-xs text-text-muted mb-1">💸 Extra Cost</div>
                  <div className={`text-lg font-bold ${result.extraCost > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {result.extraCost > 0 ? '+' : ''}{fmt(result.extraCost)}
                  </div>
                  <div className="text-xs text-text-muted">{result.extraPercent.toFixed(1)}%</div>
                </div>
              </div>
            </div>
            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">💡 Recommendation</h4>
              <p className="text-sm text-text">{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
