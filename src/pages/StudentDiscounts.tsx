import { useState, useEffect } from 'react';
import { Search, ExternalLink, CheckCircle, GraduationCap, CreditCard, Mail, Award } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

interface Discount {
  name: string;
  company: string;
  discount: string;
  originalPrice: number | null;
  discountedPrice: number | null;
  currency: string;
  requirements: string[];
  url: string;
  description: string;
  category: string;
  isFree: boolean;
  expiryDate: string | null;
  verified: boolean;
}

interface StudentDiscountsData {
  lastUpdated: string;
  requirements: string[];
  discounts: Discount[];
}

const categoryColors: Record<string, { bg: string; text: string; border: string; pill: string }> = {
  software: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', pill: 'bg-blue-100 text-blue-700' },
  entertainment: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', pill: 'bg-purple-100 text-purple-700' },
  cloud: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', pill: 'bg-cyan-100 text-cyan-700' },
  learning: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800', pill: 'bg-green-100 text-green-700' },
  philippine: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', pill: 'bg-red-100 text-red-700' },
  devices: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', pill: 'bg-orange-100 text-orange-700' },
};

const categoryIcons: Record<string, string> = {
  software: '💻',
  entertainment: '🎬',
  cloud: '☁️',
  learning: '📖',
  philippine: '🇵🇭',
  devices: '📱',
};

const categoryLabels: Record<string, string> = {
  software: 'Software',
  entertainment: 'Entertainment',
  cloud: 'Cloud',
  learning: 'Learning',
  philippine: 'Philippine',
  devices: 'Devices',
};

export default function StudentDiscounts() {
  const [data, setData] = useState<StudentDiscountsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/data/student-discounts.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Software', 'Entertainment', 'Cloud', 'Learning', 'Philippine', 'Devices'];

  const catNameToKey: Record<string, string> = {
    All: 'All',
    Software: 'software',
    Entertainment: 'entertainment',
    Cloud: 'cloud',
    Learning: 'learning',
    Philippine: 'philippine',
    Devices: 'devices',
  };

  const filtered = data?.discounts.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      d.name.toLowerCase().includes(q) ||
      d.company.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'All' || d.category === catNameToKey[selectedCategory];
    return matchSearch && matchCat;
  }) || [];

  const freeCount = data?.discounts.filter(d => d.isFree).length || 0;
  const verifiedCount = data?.discounts.filter(d => d.verified).length || 0;

  const formatPrice = (price: number | null, currency: string) => {
    if (price === null) return null;
    if (currency === 'PHP') return `₱${price.toLocaleString()}`;
    if (currency === 'USD') return `$${price.toLocaleString()}`;
    return `${price.toLocaleString()}`;
  };

  return (
    <>
      <SEOHead
        title="Student Discounts & Free Software for Filipino Students"
        description="Discover student discounts and FREE access to premium software, entertainment, cloud services, and learning platforms for Filipino students. Save thousands of pesos!"
        keywords="student discounts Philippines, free software students, .edu.ph discounts, Filipino student deals"
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <GraduationCap size={28} className="text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-text">
              Student Discounts & Free Software
            </h1>
          </div>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto">
            Filipino students get discounts and FREE access to premium software!
          </p>
          {data && (
            <p className="text-[10px] text-text-muted mt-2">
              Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Requirements Info Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-lg p-2 shrink-0">
              <Award size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text mb-2 flex items-center gap-1.5">
                What You Need to Claim Discounts
              </h3>
              <div className="flex flex-wrap gap-2">
                {data?.requirements.map((req, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-800 border border-border rounded-lg px-2.5 py-1.5 text-text-secondary">
                    {i === 0 && <Mail size={12} className="text-primary shrink-0" />}
                    {i === 1 && <CreditCard size={12} className="text-primary shrink-0" />}
                    {i === 2 && <CheckCircle size={12} className="text-primary shrink-0" />}
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {data && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-primary">{data.discounts.length}</p>
              <p className="text-[10px] text-text-muted">Total Deals</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-green-600">{freeCount}</p>
              <p className="text-[10px] text-text-muted">Free Items</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-blue-600">{verifiedCount}</p>
              <p className="text-[10px] text-text-muted">Verified</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search software or service name... (e.g. Microsoft, Spotify, Canva)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => {
            const key = catNameToKey[cat];
            const count = cat === 'All'
              ? data?.discounts.length || 0
              : data?.discounts.filter(d => d.category === key).length || 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface-alt text-text-secondary hover:bg-border'
                }`}
              >
                {cat !== 'All' && <span>{categoryIcons[key]}</span>}
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-text-muted">Loading discounts...</p>
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <p className="text-xs text-text-muted mb-4">
            Showing {filtered.length} of {data?.discounts.length || 0} discounts
          </p>
        )}

        {/* Discount Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((discount, idx) => {
            const cat = categoryColors[discount.category] || categoryColors.software;
            return (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-800 border rounded-xl overflow-hidden transition-all hover:card-shadow ${cat.border} flex flex-col`}
              >
                <div className="p-4 flex-1 flex flex-col">
                  {/* Badges Row */}
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    {discount.isFree && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-500 text-white">
                        FREE
                      </span>
                    )}
                    {discount.verified && (
                      <span className="flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-medium">
                        <CheckCircle size={10} />
                        Verified
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cat.pill}`}>
                      {categoryIcons[discount.category]} {categoryLabels[discount.category]}
                    </span>
                  </div>

                  {/* Company & Name */}
                  <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide mb-0.5">
                    {discount.company}
                  </p>
                  <h3 className="text-sm font-semibold text-text mb-1.5 leading-tight">
                    {discount.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-text-secondary line-clamp-2 mb-3">
                    {discount.description}
                  </p>

                  {/* Discount Badge + Price */}
                  <div className="mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg inline-block ${
                      discount.isFree
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {discount.discount}
                    </span>
                    {discount.originalPrice !== null && discount.discountedPrice !== null && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-text-muted line-through">
                          {formatPrice(discount.originalPrice, discount.currency)}
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          {discount.discountedPrice === 0
                            ? 'FREE'
                            : formatPrice(discount.discountedPrice, discount.currency)}
                        </span>
                        <span className="text-[10px] text-text-muted">/month</span>
                      </div>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="mb-3 mt-auto">
                    <p className="text-[10px] text-text-muted font-medium mb-1">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {discount.requirements.map((req, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-alt text-text-secondary border border-border">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Claim Button */}
                <div className="border-t border-border px-4 py-2.5">
                  <a
                    href={discount.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-xs font-medium w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                  >
                    Claim Discount
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <GraduationCap size={32} className="text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-muted">No discounts found matching your search.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              className="text-xs text-primary mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
