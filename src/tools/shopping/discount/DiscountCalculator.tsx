import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatPeso, formatNumber } from '../../../utils/format';

export default function DiscountCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'discount-calculator')!;
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [additionalDiscount, setAdditionalDiscount] = useState('');
  const [result, setResult] = useState<{
    original: number;
    discount1: number;
    afterFirst: number;
    discount2: number;
    final: number;
    totalSaved: number;
  } | null>(null);

  const handleCalculate = () => {
    const price = parseFloat(originalPrice);
    const disc = parseFloat(discountPercent);
    const addDisc = parseFloat(additionalDiscount) || 0;

    if (isNaN(price) || isNaN(disc) || price <= 0 || disc < 0) return;

    const discount1 = price * (disc / 100);
    const afterFirst = price - discount1;
    const discount2 = afterFirst * (addDisc / 100);
    const final = afterFirst - discount2;
    const totalSaved = price - final;

    setResult({
      original: price,
      discount1,
      afterFirst,
      discount2,
      final,
      totalSaved,
    });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `You save ${formatPeso(result.totalSaved)} (${formatNumber((result.totalSaved / result.original) * 100)}% total discount). Final price: ${formatPeso(result.final)}` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <Input
          label="Original Price"
          prefix="₱"
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          placeholder="1000"
        />
        <Input
          label="Discount (%)"
          type="number"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
          placeholder="20"
          hint="e.g. 20 for 20% off"
        />
        <Input
          label="Additional Discount (%)"
          type="number"
          value={additionalDiscount}
          onChange={(e) => setAdditionalDiscount(e.target.value)}
          placeholder="0"
          hint="Optional: for double/triple discounts"
        />
        <Button onClick={handleCalculate} className="w-full">
          Calculate Discount
        </Button>
      </div>

      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <p className="text-xs text-green-600 font-medium mb-1">You Save</p>
              <p className="text-2xl font-bold text-green-600">{formatPeso(result.totalSaved)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Original Price</span>
                <span className="font-medium text-text">{formatPeso(result.original)}</span>
              </div>
              {result.discount1 > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">1st Discount</span>
                  <span className="text-green-600">-{formatPeso(result.discount1)}</span>
                </div>
              )}
              {result.discount2 > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">After 1st Discount</span>
                    <span className="text-text">{formatPeso(result.afterFirst)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">2nd Discount</span>
                    <span className="text-green-600">-{formatPeso(result.discount2)}</span>
                  </div>
                </>
              )}
              <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
                <span className="text-text">Final Price</span>
                <span className="text-primary">{formatPeso(result.final)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
