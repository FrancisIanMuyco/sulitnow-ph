import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function SellerFeeCalculator() {
  const [platform, setPlatform] = useState<'shopee' | 'lazada' | 'tiktokshop'>('shopee');
  const [feeData, setFeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState('');
  const [commission, setCommission] = useState('5');
  const [isMall, setIsMall] = useState(false);

  useEffect(() => {
    fetch('/data/marketplace-fees.json')
      .then(r => r.json())
      .then(d => { setFeeData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const calculate = () => {
    if (!feeData) return null;
    const p = parseFloat(price) || 0;
    if (p <= 0) return null;
    const commRate = (parseFloat(commission) || 5) / 100;
    const pf = feeData[platform];
    if (!pf) return null;
    const fees = pf.fees;

    const commissionFee = p * commRate;
    const serviceFee = p * (fees.serviceFee || 0.056);
    const transactionFee = p * (fees.transactionFee || 0.0224);
    const paymentFee = p * (fees.paymentFee || 0.02);
    const techFee = p * (fees.techFee?.[isMall ? 'mall' : 'marketplace'] || 0.02);

    const totalFees = commissionFee + serviceFee + transactionFee + paymentFee + techFee;
    const netReceive = p - totalFees;
    const effectiveRate = (totalFees / p) * 100;

    return { commissionFee, serviceFee, transactionFee, paymentFee, techFee, totalFees, netReceive, effectiveRate };
  };

  const result = calculate();

  return (
    <ToolLayout
      tool={{ id: 'seller-fee-calculator', name: 'Shopee/Lazada Seller Fee Calculator', slug: 'seller-fee-calculator', description: 'Compute actual seller fees and net profit for Shopee, Lazada, TikTok Shop Philippines.', category: 'shopping', keywords: [], icon: 'Store', status: 'active', path: '/tools/seller-fee-calculator', requiresApi: false }}
    >
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Platform Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'shopee', label: '🟠 Shopee', color: 'orange' },
              { key: 'lazada', label: '🔵 Lazada', color: 'blue' },
              { key: 'tiktokshop', label: '⚫ TikTok Shop', color: 'gray' },
            ].map(pl => (
              <button key={pl.key} onClick={() => setPlatform(pl.key as any)}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition ${
                  platform === pl.key
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-500 dark:text-emerald-300'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                {pl.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price (₱)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 500"
                className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Commission Rate (%)</label>
              <input type="number" value={commission} onChange={e => setCommission(e.target.value)} placeholder="e.g. 5"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
              <p className="text-xs text-gray-500 mt-1">
                {platform === 'shopee' && 'Shopee: 1%-6% (Marketplace) or 1%-8% (Mall)'}
                {platform === 'lazada' && 'Lazada: 1%-6.5% (Marketplace) or 1%-8% (Mall)'}
                {platform === 'tiktokshop' && 'TikTok: 1%-5%'}
              </p>
            </div>
            {platform !== 'tiktokshop' && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isMall} onChange={e => setIsMall(e.target.checked)} className="rounded" />
                <span className="text-gray-700 dark:text-gray-300">
                  {platform === 'shopee' ? 'Shopee Mall Seller' : 'LazMall Seller'}
                </span>
              </label>
            )}
          </div>

          {result && (
            <>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                <p className="text-sm opacity-90 mb-1">Net Amount You Receive</p>
                <p className="text-4xl font-bold">₱{result.netReceive.toFixed(2)}</p>
                <p className="text-sm opacity-80 mt-1">
                  From ₱{parseFloat(price).toFixed(2)} selling price — {result.effectiveRate.toFixed(1)}% goes to platform fees
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Fee Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Commission Fee</span>
                    <span className="text-red-600 dark:text-red-400">-₱{result.commissionFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                    <span className="text-red-600 dark:text-red-400">-₱{result.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Transaction Fee</span>
                    <span className="text-red-600 dark:text-red-400">-₱{result.transactionFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payment Processing</span>
                    <span className="text-red-600 dark:text-red-400">-₱{result.paymentFee.toFixed(2)}</span>
                  </div>
                  {result.techFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tech Fee</span>
                      <span className="text-red-600 dark:text-red-400">-₱{result.techFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-bold">
                    <span className="text-gray-600 dark:text-gray-400">Total Fees</span>
                    <span className="text-red-600 dark:text-red-400">-₱{result.totalFees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">Net Receive</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg">₱{result.netReceive.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* What you need to sell to hit target */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Quick Tip</h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  To earn ₱{result.netReceive.toFixed(2)} after all fees, your selling price should be at least <strong>₱{(result.netReceive / (1 - result.effectiveRate/100)).toFixed(2)}</strong>.
                  Platform takes <strong>{result.effectiveRate.toFixed(1)}%</strong> total.
                </p>
              </div>

              {/* Fee Comparison */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">📊 Fee Comparison</h3>
                <div className="space-y-2 text-sm">
                  {feeData && Object.entries(feeData).filter(([k]) => k !== 'lastUpdated').map(([key, val]: [string, any]) => (
                    <div key={key} className={`flex justify-between items-center py-2 px-3 rounded-lg ${key === platform ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                      <span className="font-medium text-gray-900 dark:text-white">{val.name}</span>
                      <span className="text-gray-600 dark:text-gray-400 text-xs">
                        {key === platform ? '← Current' : val.fees?.commission?.marketplace?.max ? `Up to ${val.fees.commission.marketplace.max * 100}% commission` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-600 italic">
            Fee data as of Q2 2026. Actual rates may vary by category. Check {platform === 'shopee' ? 'seller.shopee.ph' : platform === 'lazada' ? 'seller.lazada.com.ph' : 'seller.tiktok.com'} for latest rates.
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
