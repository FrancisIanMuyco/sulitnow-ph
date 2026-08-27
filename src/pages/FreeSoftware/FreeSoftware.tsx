import { useState, useEffect } from 'react';
import { ExternalLink, Search, Star, Monitor, Smartphone, Globe, Laptop, Shield } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';

interface Alternative {
  name: string;
  description: string;
  platforms: string[];
  rating: number;
  url: string;
}

interface SoftwareEntry {
  id: string;
  paidName: string;
  paidPrice: string;
  category: string;
  alternatives: Alternative[];
}

interface SoftwareData {
  lastUpdated: string;
  software: SoftwareEntry[];
  categories: { name: string; count: number }[];
  stats: {
    totalPaid: number;
    totalAlternatives: number;
    totalCategories: number;
  };
}

const platformIcon: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Windows: Laptop,
  Mac: Monitor,
  Linux: Shield,
  Web: Globe,
  Android: Smartphone,
  iOS: Smartphone,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
        />
      ))}
      <span className="text-[10px] text-text-muted ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function FreeSoftware() {
  const [data, setData] = useState<SoftwareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/data/free-software.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = data ? ['All', ...data.categories.map(c => c.name)] : ['All'];

  const filtered = data?.software.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      s.paidName.toLowerCase().includes(q) ||
      s.alternatives.some(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchSearch && matchCat;
  }) || [];

  return (
    <div>
      <SEOHead
        title="Free Software Alternatives"
        description="Why pay? Find free alternatives to popular paid software. Save money with open-source and free tools for every category."
        keywords="free software, open source, free alternatives, free tools, save money"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Shield size={12} />
            100% Free Alternatives
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Free Software Alternatives</h1>
          <p className="text-sm md:text-base text-white/80 max-w-lg mx-auto">
            Why pay? Here are free alternatives to popular paid software.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        {data && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-primary">{data.stats.totalPaid}</p>
              <p className="text-[10px] text-text-muted">Paid Software</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-green-600">{data.stats.totalAlternatives}</p>
              <p className="text-[10px] text-text-muted">Free Alternatives</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-accent">{data.stats.totalCategories}</p>
              <p className="text-[10px] text-text-muted">Categories</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search software or alternatives..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => {
            const count = cat === 'All'
              ? data?.software.length || 0
              : data?.categories.find(c => c.name === cat)?.count || 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface-alt text-text-secondary hover:bg-border'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-text-muted">Loading software...</p>
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <p className="text-xs text-text-muted mb-4">
            Showing {filtered.length} of {data?.software.length || 0} paid software with free alternatives
          </p>
        )}

        {/* Software Cards */}
        <div className="space-y-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-800 border border-border rounded-xl overflow-hidden hover:card-shadow transition-all">
              {/* Paid Software Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                      <span className="text-lg">💰</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-text truncate">{item.paidName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                          {item.paidPrice}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-surface-alt text-text-muted">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Arrow */}
                <div className="flex items-center gap-2 mt-3 ml-5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1 whitespace-nowrap">
                    <span className="text-lg">↓</span> Free alternatives
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </div>

              {/* Alternatives */}
              <div className="p-4 space-y-3">
                {item.alternatives.map((alt, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-surface-alt/50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-green-700 dark:text-green-400">FREE</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-semibold text-text">{alt.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          FREE
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2 mb-2">{alt.description}</p>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {alt.platforms.map(plat => {
                            const Icon = platformIcon[plat] || Globe;
                            return (
                              <span key={plat} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-surface-alt text-text-muted border border-border">
                                <Icon size={10} />
                                {plat}
                              </span>
                            );
                          })}
                          <StarRating rating={alt.rating} />
                        </div>
                        <a
                          href={alt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors shrink-0"
                        >
                          Visit <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search size={32} className="text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-muted">No software found matching your search.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              className="text-xs text-primary mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
