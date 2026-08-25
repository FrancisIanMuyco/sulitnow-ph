import { Tag, Percent, ShoppingBag, ArrowRight, Info } from 'lucide-react';

const dealCategories = [
  { icon: Tag, title: 'Load Promos', desc: 'Current network promos', count: 0 },
  { icon: Percent, title: 'Discount Codes', desc: 'Vouchers and coupons', count: 0 },
  { icon: ShoppingBag, title: 'Marketplace Deals', desc: 'Shopee, Lazada, etc.', count: 0 },
];

export default function Deals() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1 flex items-center gap-2">
          <Tag size={24} className="text-accent" />
          Deals & Shopping
        </h1>
        <p className="text-sm text-text-secondary">
          Find the best deals, compare prices, and save money
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Deal tracking and price history will be available when data sources are connected. Use the shopping calculators in the meantime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {dealCategories.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white dark:bg-slate-800 border border-border rounded-xl p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
              <Icon size={22} />
            </div>
            <h3 className="text-sm font-semibold text-text mb-1">{title}</h3>
            <p className="text-xs text-text-muted">{desc}</p>
            <p className="text-xs text-primary mt-2 font-medium">Coming Soon</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-alt border border-border rounded-xl p-6 text-center">
        <p className="text-sm text-text-muted">
          In the meantime, try our shopping calculators:
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {[
            { label: 'Discount Calculator', path: '/tools/discount-calculator' },
            { label: 'Unit Price Comparator', path: '/tools/unit-price-comparator' },
            { label: 'Installment vs Cash', path: '/tools/installment-vs-cash' },
            { label: 'Voucher Savings', path: '/tools/voucher-savings' },
          ].map((tool) => (
            <a
              key={tool.path}
              href={tool.path}
              className="inline-flex items-center gap-1.5 text-xs bg-white dark:bg-slate-800 border border-border px-3 py-1.5 rounded-lg hover:border-primary/30 transition-colors"
            >
              {tool.label}
              <ArrowRight size={10} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
