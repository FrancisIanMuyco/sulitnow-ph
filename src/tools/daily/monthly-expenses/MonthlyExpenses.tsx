import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { ClipboardList, Plus, Trash2 } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'monthly-expenses')!;

const DEFAULT_CATEGORIES = ['Housing', 'Food', 'Transport', 'Utilities', 'Internet/Mobile', 'Health', 'Education', 'Entertainment', 'Savings', 'Other'];

interface Expense {
  name: string;
  category: string;
  amount: number;
}

export default function MonthlyExpenses() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([
    { name: 'Rent', category: 'Housing', amount: 0 },
    { name: 'Food/Groceries', category: 'Food', amount: 0 },
    { name: 'Transportation', category: 'Transport', amount: 0 },
  ]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const incomeVal = parseFloat(income) || 0;
  const remaining = incomeVal - totalExpenses;
  const savingsRate = incomeVal > 0 ? ((remaining / incomeVal) * 100) : 0;

  const addExpense = () => setExpenses([...expenses, { name: '', category: 'Other', amount: 0 }]);
  const removeExpense = (i: number) => setExpenses(expenses.filter((_, idx) => idx !== i));
  const updateExpense = (i: number, field: keyof Expense, val: string | number) => {
    const newExpenses = [...expenses];
    (newExpenses[i] as any)[field] = field === 'amount' ? (parseFloat(val as string) || 0) : val;
    setExpenses(newExpenses);
  };

  // Group by category
  const byCategory: Record<string, number> = {};
  expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  const fmt = (n: number) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Monthly Budget Planner</h3>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Monthly Income (₱)</label>
            <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 25000" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text">Expenses</h3>
            <button onClick={addExpense} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold"><Plus size={14} /> Add</button>
          </div>
          <div className="space-y-2">
            {expenses.map((e, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input placeholder="Name" value={e.name} onChange={ev => updateExpense(i, 'name', ev.target.value)} className="flex-1 px-2 py-1.5 rounded-lg bg-surface border border-border text-text text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                <select value={e.category} onChange={ev => updateExpense(i, 'category', ev.target.value)} className="w-24 px-1 py-1.5 rounded-lg bg-surface border border-border text-text text-xs">
                  {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" placeholder="₱" value={e.amount || ''} onChange={ev => updateExpense(i, 'amount', ev.target.value)} className="w-20 px-2 py-1.5 rounded-lg bg-surface border border-border text-text text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                <button onClick={() => removeExpense(i)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {incomeVal > 0 && (
          <div className="space-y-3">
            <div className="bg-surface-alt rounded-xl p-4 border border-border">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-text-muted">Income</span><span className="text-text font-medium">{fmt(incomeVal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-muted">Total Expenses</span><span className="text-red-500 font-medium">-{fmt(totalExpenses)}</span></div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-sm font-semibold text-text">Remaining</span>
                  <span className={`text-lg font-bold ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>{fmt(remaining)}</span>
                </div>
                <div className="text-center text-xs text-text-muted">
                  Savings Rate: <span className={`font-semibold ${savingsRate >= 20 ? 'text-green-500' : savingsRate >= 0 ? 'text-yellow-500' : 'text-red-500'}`}>{savingsRate.toFixed(1)}%</span>
                  {savingsRate < 20 && remaining >= 0 && ' — Try to save at least 20% of income!'}
                </div>
              </div>
            </div>
            {sortedCategories.length > 0 && (
              <div className="bg-surface-alt rounded-xl p-4 border border-border">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">By Category</h4>
                <div className="space-y-2">
                  {sortedCategories.map(([cat, amt]) => (
                    <div key={cat}>
                      <div className="flex justify-between text-xs mb-1"><span className="text-text-muted">{cat}</span><span className="text-text font-medium">{fmt(amt)}</span></div>
                      <div className="w-full bg-surface rounded-full h-1.5">
                        <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${Math.min(100, totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
