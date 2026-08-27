import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Zap, Shield, Smartphone, Banknote,
  ShoppingBag, Home as HomeIcon, Briefcase, GraduationCap,
  CheckCircle, ChevronRight, Clock, Star
} from 'lucide-react';
import { toolRegistry, categories, popularTools, quickActions } from '../../constants/toolRegistry';
import { searchTools } from '../../utils/search';
import { useRecentlyUsed } from '../../hooks/useLocalStorage';
import { useScrollReveal, useCountUp } from '../../hooks/useAnimations';
import { getIcon } from '../../utils/iconMap';
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

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-600 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function StatNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const { ref, count } = useCountUp(value, 1200);
  return (
    <span ref={ref} className="count-up">
      {count}{suffix}
    </span>
  );
}

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

  return (
    <div>
      <SEOHead
        title="SulitNow PH — Your Everyday Decision Toolkit"
        description="Compare promos, fees, prices, earnings, and daily expenses. Built for Filipinos. 50+ free calculators and tools."
        keywords="salary calculator, GWA calculator, fuel cost, discount calculator, load promo, Philippines, Filipino tools"
      />

      {/* Hero */}
      <section className="hero-gradient text-white relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="float-element top-10 left-[10%] text-4xl animate-float">💰</div>
          <div className="float-element top-20 right-[15%] text-3xl animate-float-delay">📱</div>
          <div className="float-element bottom-10 left-[20%] text-3xl animate-float-slow">🛒</div>
          <div className="float-element bottom-20 right-[10%] text-4xl animate-float">🎓</div>
          <div className="float-element top-1/2 left-[5%] text-2xl animate-float-delay">⚡</div>
          <div className="float-element top-1/3 right-[5%] text-2xl animate-float-slow">🛡️</div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 text-center relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
              Check before you spend.
            </h1>
          </div>
          <div className="animate-fade-in-up delay-100">
            <p className="text-sm md:text-base text-white/80 mb-8 max-w-lg mx-auto">
              Compare promos, fees, prices, earnings, and daily expenses — built for Filipinos.
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto relative animate-fade-in-up delay-200">
            <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-lg">
              <Search size={16} className="ml-4 text-text-muted shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search calculators, comparisons, utilities..."
                className="flex-1 px-3 py-3.5 text-sm text-text outline-none bg-transparent"
              />
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-5 py-3.5 text-sm font-medium transition-colors btn-press">
                Search
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['GCash fees', 'salary', 'load promo', 'fuel cost', 'GWA', 'discount'].map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className={`text-xs bg-white/15 hover:bg-white/25 text-white/90 px-3 py-1 rounded-full transition-all btn-press animate-fade-in-up`}
                  style={{ animationDelay: `${300 + i * 50}ms` }}
                >
                  {s}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {/* Stats bar */}
        <RevealSection>
          <div className="grid grid-cols-3 gap-3 -mt-5 relative z-20 mb-6">
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center card-shadow">
              <p className="text-xl font-bold text-primary"><StatNumber value={50} suffix="+" /></p>
              <p className="text-[10px] text-text-muted">Tools</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center card-shadow">
              <p className="text-xl font-bold text-accent"><StatNumber value={6} /></p>
              <p className="text-[10px] text-text-muted">Courses</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center card-shadow">
              <p className="text-xl font-bold text-green-600"><StatNumber value={100} suffix="%" /></p>
              <p className="text-[10px] text-text-muted">Free</p>
            </div>
          </div>
        </RevealSection>

        {/* Quick Actions */}
        <RevealSection>
          <section className="py-6">
            <h2 className="text-sm font-semibold text-text mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {quickActions.map((qa) => {
                const tool = toolRegistry.find((t) => t.id === qa.toolId);
                if (!tool) return null;
                return (
                  <Link
                    key={qa.toolId}
                    to={tool.path}
                    className="flex flex-col items-center gap-1.5 p-3 bg-white dark:bg-slate-800 border border-border rounded-xl hover:border-primary/30 card-hover text-center card-hover"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      {getIcon(qa.icon)}
                    </div>
                    <span className="text-[11px] font-medium text-text leading-tight">{qa.label}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        </RevealSection>

        {/* Recently Used */}
        {recentTools.length > 0 && (
          <RevealSection>
            <section className="py-4">
              <h2 className="text-sm font-semibold text-text mb-3 flex items-center gap-1.5">
                <Clock size={14} /> Recently Used
              </h2>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {recentTools.map((tool) => tool && (
                  <Link key={tool.id} to={tool.path} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-border rounded-xl px-3 py-2 shrink-0 card-hover">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{getIcon(tool.icon)}</div>
                    <span className="text-xs font-medium text-text whitespace-nowrap">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          </RevealSection>
        )}

        {/* Popular Tools */}
        <RevealSection>
          <section className="py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text flex items-center gap-1.5">
                <Star size={14} className="text-accent" /> Popular Tools
              </h2>
              <Link to="/tools" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {popularToolItems.map((tool) => tool && (
                <Link key={tool.id} to={tool.path}>
                  <Card hover className="p-3 h-full card-hover">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">{getIcon(tool.icon)}</div>
                    <h3 className="text-xs font-semibold text-text mb-0.5">{tool.name}</h3>
                    <p className="text-[11px] text-text-muted line-clamp-2">{tool.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </RevealSection>

        {/* Categories */}
        <RevealSection>
          <section className="py-6">
            <h2 className="text-sm font-semibold text-text mb-3 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.icon] || Smartphone;
                const count = toolRegistry.filter((t) => t.category === cat.id).length;
                return (
                  <Link key={cat.id} to={`/tools?category=${cat.id}`}>
                    <Card hover className="p-3 card-hover">
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
        </RevealSection>

        {/* Why SulitNow */}
        <RevealSection>
          <section className="py-8 border-t border-border">
            <h2 className="text-sm font-semibold text-text mb-5 text-center">Why SulitNow PH?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2.5 card-hover"><Icon size={20} /></div>
                  <h3 className="text-xs font-semibold text-text mb-0.5">{title}</h3>
                  <p className="text-[11px] text-text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </RevealSection>

        {/* Free Courses CTA */}
        <RevealSection>
          <section className="py-6 border-t border-border">
            <Link to="/learn" className="block bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-5 text-white card-hover group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <GraduationCap size={80} />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">Learn with SulitNow</h3>
                  <p className="text-xs text-white/80">6 free courses — Python, JavaScript, freelancing & more with certificates</p>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </section>
        </RevealSection>

        {/* CTA */}
        <RevealSection>
          <section className="py-10 text-center border-t border-border">
            <div className="animate-fade-in-up">
              <h2 className="text-lg font-bold text-text mb-1">Start checking before you spend</h2>
              <p className="text-xs text-text-secondary mb-5">"Before you spend, check SulitNow."</p>
              <Link to="/tools" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-dark transition-all btn-press card-shadow-lg">
                Explore All Tools <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </RevealSection>
      </div>
    </div>
  );
}
