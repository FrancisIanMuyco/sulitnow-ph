import { useState, useEffect } from 'react';
import { Tag, ShoppingBag, ArrowRight, ExternalLink, RefreshCw, Ticket, Store } from 'lucide-react';

interface Deal {
  platform: string;
  name: string;
  price: number;
  discount: string | null;
  sold: number | null;
  url: string;
  type: string;
}

interface Voucher {
  platform: string;
  store: string;
  code: string | null;
  discount: string | null;
  description: string;
  url: string;
}

interface Promo {
  platform: string;
  title: string;
  description: string;
  url: string;
}

interface DealsData {
  lastUpdated: string;
  deals: Deal[];
  vouchers: Voucher[];
  promos: Promo[];
  stats: {
    totalDeals: number;
    totalVouchers: number;
    totalPromos: number;
  };
}

export default function Deals() {
  const [data, setData] = useState<DealsData | null>(null);
  const [activeTab, setActiveTab] = useState<'deals' | 'vouchers' | 'promos'>('deals');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/deals.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const platformColors: Record<string, string> = {
    Shopee: 'bg-orange-100 text-orange-700',
    Lazada: 'bg-blue-100 text-blue-700',
    Picodi: 'bg-green-100 text-green-700',
    RetailMeNot: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1 flex items-center gap-2">
            <Tag size={24} className="text-accent" />
            Deals & Shopping
          </h1>
          <p className="text-sm text-text-secondary">
            Real-time deals from Shopee, Lazada, and more
          </p>
        </div>
        {data && (
          <span className="text-[10px] text-text-muted">
            Updated: {new Date(data.lastUpdated).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-primary">{data.stats.totalDeals}</p>
            <p className="text-[10px] text-text-muted">Deals</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-accent">{data.stats.totalVouchers}</p>
            <p className="text-[10px] text-text-muted">Vouchers</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-600">{data.stats.totalPromos}</p>
            <p className="text-[10px] text-text-muted">Promos</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'deals' as const, label: 'Deals', icon: ShoppingBag },
          { id: 'vouchers' as const, label: 'Vouchers', icon: Ticket },
          { id: 'promos' as const, label: 'Promos', icon: Store },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === id
                ? 'bg-primary text-white'
                : 'bg-surface-alt text-text-secondary hover:bg-border'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <RefreshCw size={24} className="text-text-muted mx-auto mb-2 animate-spin" />
          <p className="text-sm text-text-muted">Loading deals...</p>
        </div>
      )}

      {/* Deals Tab */}
      {activeTab === 'deals' && data && (
        <div className="space-y-3">
          {data.deals.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={32} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">No deals found. Check back later.</p>
            </div>
          ) : (
            data.deals.map((deal, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4 hover:card-shadow transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${platformColors[deal.platform] || 'bg-gray-100 text-gray-700'}`}>
                        {deal.platform}
                      </span>
                      {deal.discount && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
                          {deal.discount} OFF
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-text line-clamp-2">{deal.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-primary">₱{deal.price.toLocaleString()}</span>
                      {deal.sold && <span className="text-[10px] text-text-muted">{deal.sold} sold</span>}
                    </div>
                  </div>
                  <a href={deal.url} target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-primary transition-colors">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vouchers Tab */}
      {activeTab === 'vouchers' && data && (
        <div className="space-y-3">
          {data.vouchers.length === 0 ? (
            <div className="text-center py-12">
              <Ticket size={32} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">No vouchers found.</p>
            </div>
          ) : (
            data.vouchers.map((v, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4 hover:card-shadow transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${platformColors[v.platform] || 'bg-gray-100 text-gray-700'}`}>
                        {v.platform}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-text">{v.store}</h3>
                    {v.code && (
                      <div className="inline-block mt-1 px-3 py-1 bg-accent/10 border border-dashed border-accent rounded-lg">
                        <span className="text-xs font-bold text-accent tracking-wider">{v.code}</span>
                      </div>
                    )}
                    {v.discount && <p className="text-xs text-text-muted mt-1">{v.discount}</p>}
                  </div>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-primary transition-colors">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Promos Tab */}
      {activeTab === 'promos' && data && (
        <div className="space-y-3">
          {data.promos.length === 0 ? (
            <div className="text-center py-12">
              <Store size={32} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">No promos found.</p>
            </div>
          ) : (
            data.promos.map((p, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4 hover:card-shadow transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${platformColors[p.platform] || 'bg-gray-100 text-gray-700'}`}>
                      {p.platform}
                    </span>
                    <h3 className="text-sm font-medium text-text mt-1">{p.title}</h3>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">{p.description}</p>
                  </div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-primary transition-colors">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tools */}
      <div className="mt-8 bg-surface-alt border border-border rounded-xl p-6 text-center">
        <p className="text-sm font-medium text-text mb-3">Need to calculate savings?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: 'Discount Calculator', path: '/tools/discount-calculator' },
            { label: 'Unit Price Comparator', path: '/tools/unit-price-comparator' },
            { label: 'Voucher Savings', path: '/tools/voucher-savings' },
            { label: 'Marketplace Fees', path: '/tools/marketplace-fee' },
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
