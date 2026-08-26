import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

interface PriceData {
  gold: { price_usd: number; updated: string };
  silver: { price_usd: number };
  exchange: { usd_php: number };
  scraped_at: string;
}

export default function GoldPriceCalculator() {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weight, setWeight] = useState('1');
  const [unit, setUnit] = useState<'oz' | 'gram' | 'kg'>('gram');


  useEffect(() => {
    fetch('/data/live-prices.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError('Failed to load live data'); setLoading(false); });
  }, []);

  const goldPerOz = data?.gold?.price_usd || 0;
  const usdToPhp = data?.exchange?.usd_php || 61.68;
  const goldPerGramUsd = goldPerOz / 31.1035;
  const goldPerGramPhp = goldPerGramUsd * usdToPhp;
  const silverPerOz = data?.silver?.price_usd || 0;
  const silverPerGramUsd = silverPerOz / 31.1035;
  const silverPerGramPhp = silverPerGramUsd * usdToPhp;

  const w = parseFloat(weight) || 0;
  const totalGoldUsd = goldPerOz * w * (unit === 'gram' ? 1/31.1035 : unit === 'kg' ? 1000/31.1035 : 1);
  const totalGoldPhp = totalGoldUsd * usdToPhp;

  const karats = [24, 22, 21, 18, 14, 10];

  const lastUpdated = data?.scraped_at
    ? new Date(data.scraped_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
    : 'N/A';

  return (
    <ToolLayout
      tool={{ id: 'gold-price-calculator', name: 'Gold & Silver Price Calculator', slug: 'gold-price', description: 'Live gold and silver prices with weight converter', category: 'money', keywords: ['gold', 'silver', 'price', 'precious', 'metal', 'kalawakan', 'pera'], icon: 'CircleDollarSign', status: 'active', path: '/tools/gold-price', requiresApi: false }}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {/* Live Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
              <p className="text-xs text-yellow-600 mb-1">🥇 GOLD (XAU)</p>
              <p className="text-2xl font-bold text-yellow-600">${goldPerOz.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-gray-400">/troy oz</p>
              <p className="text-sm font-medium mt-1">₱{goldPerGramPhp.toLocaleString(undefined, { maximumFractionDigits: 2 })}/g</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">🥈 SILVER (XAG)</p>
              <p className="text-2xl font-bold text-gray-600">${silverPerOz.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-gray-400">/troy oz</p>
              <p className="text-sm font-medium mt-1">₱{silverPerGramPhp.toLocaleString(undefined, { maximumFractionDigits: 2 })}/g</p>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400">
            🟢 Live · Last updated: {lastUpdated}
          </div>

          {/* Converter */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">⚖️ Weight Converter</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Weight</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min="0" step="0.01"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Unit</label>
                <div className="flex gap-1">
                  {(['gram', 'oz', 'kg'] as const).map(u => (
                    <button key={u} onClick={() => setUnit(u)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${unit === u ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {w > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gold value (USD)</span>
                  <span className="font-semibold">${totalGoldUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gold value (PHP)</span>
                  <span className="font-bold text-yellow-600">₱{totalGoldPhp.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            )}
          </div>

          {/* Karat breakdown */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm">💎 Value by Karat</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {karats.map(k => {
                const purity = k / 24;
                const valuePerGram = goldPerGramPhp * purity;
                const totalValue = valuePerGram * w;
                return (
                  <div key={k} className="flex justify-between items-center px-4 py-2">
                    <div>
                      <span className="font-medium text-sm">{k}K Gold</span>
                      <span className="text-xs text-gray-400 ml-2">({(purity * 100).toFixed(1)}% pure)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">₱{valuePerGram.toLocaleString(undefined, { maximumFractionDigits: 2 })}/g</span>
                      {w > 0 && <span className="text-xs text-gray-400 block">₱{totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} total</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gold/Silver ratio */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2">📊 Gold/Silver Ratio</h3>
            <p className="text-3xl font-bold text-primary">{(goldPerOz / silverPerOz).toFixed(1)}:1</p>
            <p className="text-xs text-gray-400 mt-1">
              Historical average: ~60:1 · Current: {goldPerOz / silverPerOz > 80 ? 'Silver undervalued' : goldPerOz / silverPerOz < 50 ? 'Gold undervalued' : 'Near average'}
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 text-xs text-yellow-700 dark:text-yellow-300">
            ⚠️ Prices are spot prices from gold-api.com. Actual buying/selling prices at Philippine gold shops may differ due to premiums,加工 fees, and dealer margins.
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
