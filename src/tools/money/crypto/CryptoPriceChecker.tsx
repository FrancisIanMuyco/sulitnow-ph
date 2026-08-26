import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

interface CryptoData {
  [key: string]: {
    php: number;
    usd: number;
    php_24h_change?: number;
    usd_24h_change?: number;
    php_24h_vol?: number;
    php_market_cap?: number;
  };
}

interface PriceData {
  crypto: CryptoData;
  exchange: { usd_php: number };
  scraped_at: string;
}

const COIN_NAMES: Record<string, { name: string; symbol: string; color: string }> = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  tether: { name: 'Tether', symbol: 'USDT', color: '#26A17B' },
  solana: { name: 'Solana', symbol: 'SOL', color: '#9945FF' },
  binancecoin: { name: 'BNB', symbol: 'BNB', color: '#F3BA2F' },
  ripple: { name: 'XRP', symbol: 'XRP', color: '#23292F' },
  dogecoin: { name: 'Dogecoin', symbol: 'DOGE', color: '#C2A633' },
  cardano: { name: 'Cardano', symbol: 'ADA', color: '#0033AD' },
  tron: { name: 'TRON', symbol: 'TRX', color: '#FF0013' },
  litecoin: { name: 'Litecoin', symbol: 'LTC', color: '#BFBBBB' },
};

export default function CryptoPriceChecker() {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('1');
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  useEffect(() => {
    fetch('/data/live-prices.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const crypto = data?.crypto;
  const lastUpdated = data?.scraped_at
    ? new Date(data.scraped_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
    : 'N/A';

  const amt = parseFloat(amount) || 0;
  const selectedData = crypto?.[selectedCoin];
  const coinInfo = COIN_NAMES[selectedCoin] || { name: selectedCoin, symbol: '??', color: '#666' };

  const formatPhp = (v: number) => `₱${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const formatUsd = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <ToolLayout
      tool={{ id: 'crypto-price-checker', name: 'Crypto Price Checker', slug: 'crypto-prices', description: 'Live cryptocurrency prices in PHP and USD', category: 'money', keywords: ['crypto', 'bitcoin', 'ethereum', 'usdt', 'solana', 'price', 'convert'], icon: 'Coins', status: 'active', path: '/tools/crypto-prices', requiresApi: false }}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : !crypto ? (
        <div className="text-center py-8 text-red-500">Failed to load crypto data</div>
      ) : (
        <div className="space-y-4">
          {/* Converter */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">💱 Quick Convert</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Amount ({coinInfo.symbol})</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.0001"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Coin</label>
                <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm">
                  {Object.entries(COIN_NAMES).map(([key, info]) => (
                    <option key={key} value={key}>{info.symbol} — {info.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {selectedData && amt > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">In PHP</span>
                  <span className="font-bold text-primary">{formatPhp(amt * selectedData.php)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">In USD</span>
                  <span className="font-semibold">{formatUsd(amt * selectedData.usd)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-gray-400">
            🟢 Live · CoinGecko · {lastUpdated}
          </div>

          {/* All coins */}
          <div className="space-y-2">
            {Object.entries(crypto).map(([key, prices]) => {
              const info = COIN_NAMES[key] || { name: key, symbol: key.toUpperCase(), color: '#666' };
              const change24h = prices.php_24h_change || 0;
              const isUp = change24h >= 0;
              return (
                <div key={key} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: info.color }}>
                      {info.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{info.name}</p>
                      <p className="text-xs text-gray-400">{info.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPhp(prices.php)}</p>
                    <p className="text-xs text-gray-400">{formatUsd(prices.usd)}</p>
                    <p className={`text-xs font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {isUp ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Market data for selected */}
          {selectedData && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">📊 {coinInfo.name} Market Data</h3>
              <div className="space-y-2 text-sm">
                {selectedData.php_market_cap && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Market Cap (PHP)</span>
                    <span className="font-medium">₱{(selectedData.php_market_cap / 1e9).toFixed(2)}B</span>
                  </div>
                )}
                {selectedData.php_24h_vol && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">24h Volume (PHP)</span>
                    <span className="font-medium">₱{(selectedData.php_24h_vol / 1e9).toFixed(2)}B</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">1 BTC equivalent</span>
                  <span className="font-medium">{(1 / (selectedData.php / (crypto.bitcoin?.php || 1))).toFixed(6)} BTC</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 text-xs text-yellow-700 dark:text-yellow-300">
            ⚠️ Prices from CoinGecko. Actual trading prices may vary by exchange. Not financial advice.
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
