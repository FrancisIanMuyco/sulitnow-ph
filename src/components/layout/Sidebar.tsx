import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toolRegistry, categories } from '../../constants/toolRegistry';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const getIcon = (iconName: string) => {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName];
  return Icon ? <Icon size={16} /> : null;
};

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useLocalStorage<Record<string, boolean>>('sidebar-collapsed', {});

  const toolsByCategory = useMemo(() => {
    const map: Record<string, typeof toolRegistry> = {};
    for (const cat of categories) {
      map[cat.id] = toolRegistry.filter((t) => t.category === cat.id);
    }
    return map;
  }, []);

  const toggleCategory = (catId: string) => {
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 border-r border-border bg-surface overflow-hidden">
      <div className="flex-1 overflow-y-auto py-3 px-3 no-scrollbar">
        {/* Top links */}
        <div className="mb-3">
          <Link
            to="/tools"
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/tools'
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:bg-surface-alt hover:text-text'
            }`}
          >
            <Star size={16} />
            All Tools
          </Link>
        </div>

        <div className="border-t border-border pt-2">
          {categories.map((cat) => {
            const isCollapsed = collapsed[cat.id] === true;
            const tools = toolsByCategory[cat.id] || [];
            const hasActiveTool = tools.some((t) => location.pathname === t.path);

            return (
              <div key={cat.id} className="mb-1">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors group ${
                    hasActiveTool
                      ? 'text-primary bg-primary/5'
                      : 'text-text hover:bg-surface-alt text-text-secondary'
                  }`}
                >
                  {getIcon(cat.icon)}
                  <span className="flex-1 text-left">{cat.name}</span>
                  <span className="text-[10px] text-text-muted mr-1">{tools.length}</span>
                  {isCollapsed ? (
                    <ChevronRight size={14} className="text-text-muted group-hover:text-text-secondary" />
                  ) : (
                    <ChevronDown size={14} className="text-text-muted group-hover:text-text-secondary" />
                  )}
                </button>

                {!isCollapsed && (
                  <div className="ml-3 border-l border-border pl-2 mt-0.5 mb-2">
                    {tools.map((tool) => {
                      const isActive = location.pathname === tool.path;
                      return (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-text-secondary hover:bg-surface-alt hover:text-text'
                          }`}
                        >
                          {getIcon(tool.icon)}
                          <span className="truncate">{tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
