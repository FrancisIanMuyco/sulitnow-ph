import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { Store } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'marketplace-fee')!;

const MARKETPLACES = [
  { name: 'Shopee', sellerFee: 5, paymentFee: 2.5, freeShippingSubsidy: 5 },
  { name: 'Lazada', sellerFee: 5, paymentFee: 2, freeShippingSubsidy: 0 },
  { name: 'TikTok Shop', sellerFee: 5, paymentFee: 2, freeShippingSubsidy: 0 },
  { name: 'Facebook Marketplace', sellerFee: 0, paymentFee: 0, freeShippingSubsidy: 0 },
  { name: 'Carousell', sellerFee: 0, paymentFee: 0, freeShippingSubsidy: 0 },
];

export default function MarketplaceFeeCalculator() {
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState('Shopee');
  const [shippingCost, setShippingCost] = useState('');
  const mp = MARKETPLACES.find(m => m.name === selectedMarketplace)!;
  
  const price = parseFloat(sellingPrice) || 0;
  const cost = parseFloat(costPrice) || 0;
  const shipping = parseFloat(shippingCost) || 0;
  const sellerFeeAmt = price * (mp.sellerFee / 100);
  const paymentFeeAmt = price * (mp.paymentFee / 100);
  const totalFees = sellerFeeAmt + paymentFeeAmt;
  const netEarnings = price - totalFees - cost - shipping;
  const profitMargin = price > 0 ? (netEarnings / price) * 100 : 0;

  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Store size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Marketplace Fee Calculator</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Marketplace</label>
              <select value={selectedMarketplace} onChange={e => setSelectedMarketplace(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {MARKETPLACES.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Selling Price (₱)</label>
              <input type="number" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} placeholder="e.g. 500" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Your Cost (₱, optional)</label>
              <input type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} placeholder="e.g. 300" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Shipping Cost (₱, optional)</label>
              <input type="number" value={shippingCost} onChange={e => setShippingCost(e.target.value)} placeholder="e.g. 80" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="mt-4 p-3 bg-surface rounded-lg border border-border text-xs text-text-muted space-y-1">
            <div className="font-semibold text-text mb-1">{mp.name} Fee Structure:</div>
            <div>Seller Commission: {mp.sellerFee}%</div>
            <div>Payment Fee: {mp.paymentFee}%</div>
            {mp.freeShippingSubsidy > 0 && <div>Free Shipping Subsidy: ~{mp.freeShippingSubsidy}%</div>}
          </div>
        </div>

        {price > 0 && (
          <div className="bg-surface-alt rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Fee Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-text-muted">Selling Price</span><span className="text-text font-medium">{fmt(price)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Seller Commission ({mp.sellerFee}%)</span><span className="text-red-500">-{fmt(sellerFeeAmt)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Payment Fee ({mp.paymentFee}%)</span><span className="text-red-500">-{fmt(paymentFeeAmt)}</span></div>
              {cost > 0 && <div className="flex justify-between text-sm"><span className="text-text-muted">Your Cost</span><span className="text-red-500">-{fmt(cost)}</span></div>}
              {shipping > 0 && <div className="flex justify-between text-sm"><span className="text-text-muted">Shipping</span><span className="text-red-500">-{fmt(shipping)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-text-muted">Total Fees</span><span className="text-red-500 font-medium">{fmt(totalFees)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-sm font-semibold text-text">Net Earnings</span>
                <span className={`text-lg font-bold ${netEarnings >= 0 ? 'text-green-500' : 'text-red-500'}`}>{fmt(netEarnings)}</span>
              </div>
              {cost > 0 && <div className="text-center"><span className={`text-xs font-semibold ${profitMargin >= 20 ? 'text-green-500' : profitMargin >= 0 ? 'text-yellow-500' : 'text-red-500'}`}>Profit Margin: {profitMargin.toFixed(1)}%</span></div>}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
