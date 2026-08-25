import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toolRegistry, categories } from '../../constants/toolRegistry';
import type { ToolCategory, ToolStatus } from '../../types';
import Card from '../../components/ui/Card';

const statusLabels: Record<ToolStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  'coming-soon': { label: 'Coming Soon', color: 'bg-blue-100 text-blue-700' },
  demo: { label: 'Demo', color: 'bg-yellow-100 text-yellow-700' },
  beta: { label: 'Beta', color: 'bg-purple-100 text-purple-700' },
};

export default function Tools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const activeCategory = (searchParams.get('category') || '') as ToolCategory | '';

  const filteredTools = useMemo(() => {
    let tools = toolRegistry;

    if (activeCategory) {
      tools = tools.filter((t) => t.category === activeCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.includes(q))
      );
    }

    return tools;
  }, [activeCategory, search]);

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName];
    return Icon ? <Icon size={18} /> : null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1">All Tools</h1>
        <p className="text-sm text-text-secondary">Find the right tool for your needs</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools..."
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border bg-white dark:bg-slate-800 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        <button
          onClick={() => setSearchParams({})}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            !activeCategory
              ? 'bg-primary text-white'
              : 'bg-surface-alt text-text-secondary hover:bg-border'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSearchParams({ category: cat.id })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-primary text-white'
                : 'bg-surface-alt text-text-secondary hover:bg-border'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTools.map((tool) => {
          const status = statusLabels[tool.status];
          return (
            <Link key={tool.id} to={tool.path}>
              <Card hover className="p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {getIcon(tool.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-text truncate">{tool.name}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-2">{tool.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Filter size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-muted">No tools found matching your search</p>
        </div>
      )}
    </div>
  );
}
