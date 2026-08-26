import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Zap, Shield, Smartphone, Banknote,
  ShoppingBag, Home as HomeIcon, Briefcase,
  CheckCircle, ChevronRight, Clock
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toolRegistry, categories, popularTools, quickActions } from '../../constants/toolRegistry';
import { searchTools } from '../../utils/search';
import { useRecentlyUsed } from '../../hooks/useLocalStorage';
import Card from '../../components/ui/Card';
import SEOHead from '../../components/common/SEOHead';

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Smartphone, Banknote, ShoppingBag, Home: HomeIcon, Shield, Briefcase,
};

const features = [
  { icon: Zap, title: 'Fast', desc: 'Instant calculations in your browser' },
  { icon: CheckCircle, title: 'Free', desc: '₱0/month — no signup required' },
  { icon: Smartphone, title: 'Mobile-first', desc: 'Designed for your phone' },
  { icon: Shield, title: 'Transparent', desc: 'Every formula explained' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { recent } = useRecentlyUsed();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length >= 2) {
      const results = searchTools(toolRegistry, query);
      if (results.length > 0) navigate(results[0].tool.path);
    }
  };

  const popularToolItems = popularTools.map((id) => toolRegistry.find((t) => t.id === id)).filter(Boolean).slice(0, 8);
  const recentTools = recent.map((id) => toolRegistry.find((t) => t.id === id)).filter(Boolean).slice(0, 5);

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName];
    return Icon ? <Icon size={18} /> : null;
  };

  return (
    <div>
      <SEOHead
        title="SulitNow PH — Your Everyday Decision Toolkit"
        description="Compare promos, fees, prices, earnings, and daily expenses. Built for Filipinos. 50+ free calculators and tools."
        keywords="salary calculator, GWA calculator, fuel cost, discount calculator, load promo, Philippines, Filipino tools"
      />
      {/* Hero */}
      <section className="sulit-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
            Check before you spend.
          </h1>
          <p className="text-sm md:text-base text-white/80 mb-6 max-w-lg mx-auto">
            Compare promos, fees, prices, earnings, and daily expenses — built for Filipinos.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto relative">
            <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-lg">
              <Search size={16} className="ml-4 text-text-muted shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search calculators, comparisons, utilities..."
                className="flex-1 px-3 py-3 text-sm text-text outline-none bg-transparent"
              />
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 py-3 text-sm font-medium transition-colors">
                Search
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {['GCash fees', 'salary', 'load promo', 'fuel cost', 'GWA', 'discount'].map((s) => (
                <button key={s} type="button" onClick={() => setQuery(s)} className="text-xs bg-white/15 hover:bg-white/25 text-white/90 px-3 py-1 rounded-full transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {/* Quick Actions */}
        <section className="py-6">
          <h2 className="text-sm font-semibold text-text mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {quickActions.map((qa) => {
              const tool = toolRegistry.find((t) => t.id === qa.toolId);
              if (!tool) return null;
              return (
                <Link key={qa.toolId} to={tool.path} className="flex flex-col items-center gap-1.5 p-3 bg-white dark:bg-slate-800 border border-border rounded-xl hover:border-primary/30 hover:card-shadow transition-all text-center">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    {getIcon(qa.icon)}
                  </div>
                  <span className="text-[11px] font-medium text-text leading-tight">{qa.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recently Used */}
        {recentTools.length > 0 && (
          <section className="py-4">
            <h2 className="text-sm font-semibold text-text mb-3 flex items-center gap-1.5">
              <Clock size={14} /> Recently Used
            </h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {recentTools.map((tool) => tool && (
                <Link key={tool.id} to={tool.path} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-border rounded-xl px-3 py-2 shrink-0 hover:border-primary/30 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{getIcon(tool.icon)}</div>
                  <span className="text-xs font-medium text-text whitespace-nowrap">{tool.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Tools */}
        <section className="py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text">Popular Tools</h2>
            <Link to="/tools" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {popularToolItems.map((tool) => tool && (
              <Link key={tool.id} to={tool.path}>
                <Card hover className="p-3 h-full">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">{getIcon(tool.icon)}</div>
                  <h3 className="text-xs font-semibold text-text mb-0.5">{tool.name}</h3>
                  <p className="text-[11px] text-text-muted line-clamp-2">{tool.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="py-6">
          <h2 className="text-sm font-semibold text-text mb-3 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.icon] || Smartphone;
              const count = toolRegistry.filter((t) => t.category === cat.id).length;
              return (
                <Link key={cat.id} to={`/tools?category=${cat.id}`}>
                  <Card hover className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon size={18} /></div>
                      <div>
                        <h3 className="text-xs font-semibold text-text">{cat.name}</h3>
                        <p className="text-[10px] text-text-muted">{count} tools</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Why SulitNow */}
        <section className="py-8 border-t border-border">
          <h2 className="text-sm font-semibold text-text mb-4 text-center">Why SulitNow PH?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2"><Icon size={18} /></div>
                <h3 className="text-xs font-semibold text-text mb-0.5">{title}</h3>
                <p className="text-[11px] text-text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 text-center border-t border-border">
          <h2 className="text-lg font-bold text-text mb-1">Start checking before you spend</h2>
          <p className="text-xs text-text-secondary mb-4">"Before you spend, check SulitNow."</p>
          <Link to="/tools" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
            Explore All Tools <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
}
