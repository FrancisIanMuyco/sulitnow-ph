import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import { formatPeso } from '../../../utils/format';
import { Plus, Trash2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

let nextId = 1;

export default function UnitPriceComparator() {
  const tool = toolRegistry.find((t) => t.id === 'unit-price-comparator')!;
  const [products, setProducts] = useState<Product[]>([
    { id: nextId++, name: 'Product A', price: 0, quantity: 0, unit: 'kg' },
    { id: nextId++, name: 'Product B', price: 0, quantity: 0, unit: 'kg' },
  ]);

  const addProduct = () => {
    setProducts([...products, { id: nextId++, name: `Product ${String.fromCharCode(65 + products.length)}`, price: 0, quantity: 0, unit: 'kg' }]);
  };

  const removeProduct = (id: number) => {
    if (products.length <= 2) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: number, field: keyof Product, value: string | number) => {
    setProducts(products.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const getResults = () => {
    const valid = products.filter((p) => p.price > 0 && p.quantity > 0);
    if (valid.length < 2) return null;

    const results = valid.map((p) => ({
      ...p,
      unitPrice: p.price / p.quantity,
    }));

    results.sort((a, b) => a.unitPrice - b.unitPrice);
    return results;
  };

  const results = getResults();

  return (
    <ToolLayout
      tool={tool}
      recommendation={results ? `Best deal: ${results[0].name} at ${formatPeso(results[0].unitPrice)} per ${results[0].unit}.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="bg-surface-alt rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text">Option {String.fromCharCode(65 + index)}</span>
              {products.length > 2 && (
                <button onClick={() => removeProduct(product.id)} className="text-text-muted hover:text-red-500">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <input
              type="text"
              value={product.name}
              onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
              placeholder="Product name"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white dark:bg-slate-800 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-text-muted mb-0.5">Price (₱)</label>
                <input
                  type="number"
                  value={product.price || ''}
                  onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-white dark:bg-slate-800 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-[10px] text-text-muted mb-0.5">Quantity</label>
                <input
                  type="number"
                  value={product.quantity || ''}
                  onChange={(e) => updateProduct(product.id, 'quantity', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-white dark:bg-slate-800 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-[10px] text-text-muted mb-0.5">Unit</label>
                <select
                  value={product.unit}
                  onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-white dark:bg-slate-800 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="mL">mL</option>
                  <option value="pcs">pcs</option>
                  <option value="pack">pack</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addProduct}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-primary hover:bg-primary/5 py-2 rounded-lg transition-colors"
        >
          <Plus size={12} />
          Add Product
        </button>
      </div>

      {results && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {results.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  i === 0
                    ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                    : 'bg-surface-alt'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    {i === 0 && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-medium">BEST</span>}
                    <span className="text-sm font-medium text-text">{r.name}</span>
                  </div>
                  <span className="text-xs text-text-muted">{formatPeso(r.price)} / {r.quantity} {r.unit}</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${i === 0 ? 'text-green-600' : 'text-text'}`}>
                    {formatPeso(r.unitPrice)}
                  </p>
                  <p className="text-[10px] text-text-muted">per {r.unit}</p>
                </div>
              </div>
            ))}

            {results.length > 1 && (
              <p className="text-xs text-text-secondary text-center">
                You save {formatPeso(results[results.length - 1].unitPrice - results[0].unitPrice)} per {results[0].unit} by choosing {results[0].name}
              </p>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
