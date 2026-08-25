import { useState, useEffect } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

interface CurrencyData {
  lastUpdated: string;
  source: string;
  rates: Record<string, { rate: number; name: string; symbol: string; change: number }>;
}

export default function CurrencyConverter() {
  const tool = toolRegistry.find((t) => t.id === 'currency-converter')!;
  const [data, setData] = useState<CurrencyData | null>(null);
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('PHP');
  const [toCurrency, setToCurrency] = useState('USD');
  const [result, setResult] = useState<{ from: number; to: number; rate: number; inverse: number } | null>(null);

  useEffect(() => {
    fetch('/data/currency-rates.json').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const currencies = data ? Object.entries(data.rates) : [];

  const handleConvert = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || !data) return;

    if (fromCurrency === 'PHP') {
      // PHP to foreign
      const foreign = data.rates[toCurrency];
      if (!foreign) return;
      const converted = num / foreign.rate;
      setResult({ from: num, to: converted, rate: foreign.rate, inverse: foreign.rate });
    } else if (toCurrency === 'PHP') {
      // Foreign to PHP
      const foreign = data.rates[fromCurrency];
      if (!foreign) return;
      const converted = num * foreign.rate;
      setResult({ from: num, to: converted, rate: foreign.rate, inverse: foreign.rate });
    } else {
      // Cross rate via PHP
      const from = data.rates[fromCurrency];
      const to = data.rates[toCurrency];
      if (!from || !to) return;
      const phpAmount = num * from.rate;
      const converted = phpAmount / to.rate;
      setResult({ from: num, to: converted, rate: from.rate / to.rate, inverse: to.rate / from.rate });
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  return (
    <ToolLayout tool={tool} recommendation={result ? `${result.from.toLocaleString()} ${fromCurrency} = ${result.to.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurrency}` : undefined}>
      <div className="px-4 py-4 space-y-4">
        {/* Live rates overview */}
        {data && (
          <div className="bg-surface-alt rounded-xl p-3 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-text">💱 Live Exchange Rates</p>
              <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <p className="text-[9px] text-text-muted mb-2">Source: {data.source}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {currencies.slice(0, 9).map(([code, c]) => (
                <button key={code} onClick={() => { setFromCurrency('PHP'); setToCurrency(code); setResult(null); }}
                  className="bg-surface rounded-lg p-2 text-center hover:bg-primary/5 transition border border-border hover:border-primary/30">
                  <p className="text-[9px] text-text-muted">{c.symbol} {code}</p>
                  <p className="text-[10px] font-bold text-text">₱{c.rate}</p>
                  <p className={`text-[8px] ${c.change > 0 ? 'text-green-600' : c.change < 0 ? 'text-red-500' : 'text-text-muted'}`}>
                    {c.change > 0 ? '↑' : c.change < 0 ? '↓' : '—'} {Math.abs(c.change) > 0 ? Math.abs(c.change).toFixed(3) : ''}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000" />
          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">From</label>
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-text text-sm font-medium">
                <option value="PHP">🇵🇭 PHP (₱)</option>
                {currencies.map(([code, c]) => (
                  <option key={code} value={code}>{c.symbol} {code}</option>
                ))}
              </select>
            </div>
            <button onClick={handleSwap} className="mb-1 p-2 rounded-full bg-surface-alt border border-border hover:bg-primary/10 transition">⇄</button>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">To</label>
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-text text-sm font-medium">
                <option value="PHP">🇵🇭 PHP (₱)</option>
                {currencies.map(([code, c]) => (
                  <option key={code} value={code}>{c.symbol} {code}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Button onClick={handleConvert} className="w-full">Convert</Button>
      </div>

      {result && (
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-primary font-medium mb-1">Converted Amount</p>
            <p className="text-2xl font-bold text-primary">
              {result.to.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
            </p>
            <p className="text-[10px] text-text-muted mt-1">
              1 {fromCurrency} = {result.inverse > 1 ? result.inverse.toFixed(2) : result.inverse.toFixed(4)} {toCurrency}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-alt rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted mb-0.5">You Send</p>
              <p className="text-sm font-bold text-text">{result.from.toLocaleString()} {fromCurrency}</p>
            </div>
            <div className="bg-surface-alt rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted mb-0.5">They Receive</p>
              <p className="text-sm font-bold text-green-600">{result.to.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}</p>
            </div>
          </div>
          <p className="text-[10px] text-text-muted text-center">⚠️ Rates are indicative. Banks/remittance centers may charge additional fees.</p>
        </div>
      )}
    </ToolLayout>
  );
}
