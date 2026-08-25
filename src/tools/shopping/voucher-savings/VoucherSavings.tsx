import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { Ticket } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'voucher-savings')!;

export default function VoucherSavings() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [minSpend, setMinSpend] = useState('');
  const [shippingDiscount, setShippingDiscount] = useState('');
  const [result, setResult] = useState<null | {
    subtotal: number;
    discountAmount: number;
    afterDiscount: number;
    meetsMinSpend: boolean;
    shippingSaved: number;
    finalPrice: number;
    totalSaved: number;
  }>(null);

  const calculate = () => {
    const orig = parseFloat(originalPrice) || 0;
    const val = parseFloat(discountValue) || 0;
    const min = parseFloat(minSpend) || 0;
    const ship = parseFloat(shippingDiscount) || 0;
    if (orig <= 0) return;
    const meetsMin = orig >= min;
    let discAmt = 0;
    if (meetsMin && val > 0) {
      discAmt = discountType === 'percent' ? (orig * val) / 100 : val;
      if (discAmt > orig) discAmt = orig;
    }
    const afterDisc = orig - discAmt;
    const finalPrice = Math.max(0, afterDisc - ship);
    const totalSaved = orig - finalPrice;
    setResult({ subtotal: orig, discountAmount: discAmt, afterDiscount: afterDisc, meetsMinSpend: meetsMin, shippingSaved: ship, finalPrice, totalSaved });
  };

  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Voucher Calculator</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Original Price (₱)</label>
              <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="e.g. 2500" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Discount Type</label>
              <div className="flex gap-2">
                <button onClick={() => setDiscountType('percent')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border ${discountType === 'percent' ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>% Discount</button>
                <button onClick={() => setDiscountType('fixed')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border ${discountType === 'fixed' ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>₱ Fixed</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">{discountType === 'percent' ? 'Discount %' : 'Discount Amount (₱)'}</label>
              <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder={discountType === 'percent' ? 'e.g. 20' : 'e.g. 500'} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Minimum Spend (₱, optional)</label>
              <input type="number" value={minSpend} onChange={e => setMinSpend(e.target.value)} placeholder="e.g. 1500" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Free Shipping Discount (₱, optional)</label>
              <input type="number" value={shippingDiscount} onChange={e => setShippingDiscount(e.target.value)} placeholder="e.g. 100" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <button onClick={calculate} className="w-full mt-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition">Calculate Savings</button>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="bg-surface-alt rounded-xl p-4 border border-border">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Results</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-text-muted">Subtotal</span><span className="text-text font-medium">{fmt(result.subtotal)}</span></div>
                {!result.meetsMinSpend && parseFloat(minSpend) > 0 && (
                  <div className="text-xs text-red-500 bg-red-500/10 rounded-lg p-2">⚠️ Does not meet minimum spend of {fmt(parseFloat(minSpend))}. You need {fmt(parseFloat(minSpend) - result.subtotal)} more.</div>
                )}
                <div className="flex justify-between text-sm"><span className="text-text-muted">Voucher Discount</span><span className="text-green-500 font-medium">-{fmt(result.discountAmount)}</span></div>
                {result.shippingSaved > 0 && <div className="flex justify-between text-sm"><span className="text-text-muted">Shipping Savings</span><span className="text-green-500 font-medium">-{fmt(result.shippingSaved)}</span></div>}
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-sm font-semibold text-text">Final Price</span>
                  <span className="text-lg font-bold text-primary">{fmt(result.finalPrice)}</span>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3 text-center">
                  <span className="text-sm font-semibold text-green-500">🎉 You save {fmt(result.totalSaved)} ({((result.totalSaved / result.subtotal) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
