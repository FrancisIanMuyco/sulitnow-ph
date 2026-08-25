import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'grocery-comparator')!;

interface GroceryItem {
  name: string;
  brand: string;
  price: number;
  quantity: number;
  unit: string;
}

export default function GroceryComparator() {
  const [items, setItems] = useState<GroceryItem[]>([
    { name: '', brand: '', price: 0, quantity: 1, unit: 'kg' },
    { name: '', brand: '', price: 0, quantity: 1, unit: 'kg' },
  ]);
  const [bestIdx, setBestIdx] = useState<number | null>(null);

  const units = ['kg', 'g', 'L', 'ml', 'pcs', 'pack', 'box'];

  const addItem = () => setItems([...items, { name: '', brand: '', price: 0, quantity: 1, unit: 'kg' }]);
  const removeItem = (i: number) => {
    const newItems = items.filter((_, idx) => idx !== i);
    setItems(newItems);
    setBestIdx(null);
  };
  const updateItem = (i: number, field: keyof GroceryItem, val: string | number) => {
    const newItems = [...items];
    (newItems[i] as any)[field] = field === 'name' || field === 'brand' ? val : (field === 'unit' ? val : parseFloat(val as string) || 0);
    setItems(newItems);
    setBestIdx(null);
  };

  const compare = () => {
    const prices = items.map(i => i.quantity > 0 ? i.price / i.quantity : Infinity);
    const min = Math.min(...prices);
    setBestIdx(prices.indexOf(min));
  };

  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-primary" />
              <h3 className="text-sm font-semibold text-text">Compare Grocery Prices</h3>
            </div>
            <button onClick={addItem} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition">
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className={`p-3 rounded-lg border ${bestIdx === i ? 'border-green-500 bg-green-500/5' : 'border-border bg-surface'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-text-muted">Item {i + 1}</span>
                  {items.length > 2 && <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Product name" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} className="px-2 py-1.5 rounded-lg bg-surface-alt border border-border text-text text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                  <input placeholder="Brand" value={item.brand} onChange={e => updateItem(i, 'brand', e.target.value)} className="px-2 py-1.5 rounded-lg bg-surface-alt border border-border text-text text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                  <input type="number" placeholder="Price ₱" value={item.price || ''} onChange={e => updateItem(i, 'price', e.target.value)} className="px-2 py-1.5 rounded-lg bg-surface-alt border border-border text-text text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                  <div className="flex gap-1">
                    <input type="number" placeholder="Qty" value={item.quantity || ''} onChange={e => updateItem(i, 'quantity', e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg bg-surface-alt border border-border text-text text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                    <select value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)} className="px-1 py-1.5 rounded-lg bg-surface-alt border border-border text-text text-xs focus:outline-none">
                      {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                {item.price > 0 && item.quantity > 0 && (
                  <div className="mt-2 text-xs text-text-muted">
                    Unit price: <span className={`font-semibold ${bestIdx === i ? 'text-green-500' : 'text-text'}`}>{fmt(item.price / item.quantity)}/{item.unit}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={compare} className="w-full mt-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition">Compare Unit Prices</button>
        </div>
      </div>
    </ToolLayout>
  );
}
