import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Flag, Info, Heart } from 'lucide-react';
import type { Tool } from '../../types';
import { toolRegistry } from '../../constants/toolRegistry';
import { useRecentlyUsed, useFavorites } from '../../hooks/useLocalStorage';
import { getIcon } from '../../utils/iconMap';
import SEOHead, { ToolStructuredData } from '../common/SEOHead';

interface ToolLayoutProps {
  tool: Tool;
  children: ReactNode;
  result?: ReactNode;
  recommendation?: string;
  resultText?: string;
  relatedToolIds?: string[];
}

export default function ToolLayout({
  tool,
  children,
  result,
  recommendation,
  resultText,
  relatedToolIds,
}: ToolLayoutProps) {
  const { addRecent } = useRecentlyUsed();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    addRecent(tool.id);
  }, [tool.id, addRecent]);

  const relatedTools = (relatedToolIds || [])
    .map((id) => toolRegistry.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 3);

  // Auto-derive related tools from same category
  const categoryRelated = toolRegistry
    .filter((t) => t.category === tool.category && t.id !== tool.id && t.status === 'active')
    .slice(0, 3);

  const finalRelated = relatedTools.length > 0 ? relatedTools : categoryRelated;

  const handleShare = async () => {
    const text = resultText || `Check out ${tool.name} on SulitNow PH`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: tool.name, text, url }); } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <SEOHead
        title={tool.name}
        description={tool.description}
        url={`https://sulitnow-ph.pages.dev${tool.path}`}
        keywords={tool.keywords?.join(', ')}
      />
      <ToolStructuredData
        name={tool.name}
        description={tool.description}
        url={`https://sulitnow-ph.pages.dev${tool.path}`}
        category={tool.category}
      />
      {/* Breadcrumb */}
      <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-4">
        <ArrowLeft size={14} /> All Tools
      </Link>

      {/* Tool Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {getIcon(tool.icon)}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-text">{tool.name}</h1>
          <p className="text-sm text-text-secondary mt-0.5">{tool.description}</p>
        </div>
        <button
          onClick={() => toggleFavorite(tool.id)}
          className={`p-2 rounded-lg transition-colors ${isFavorite(tool.id) ? 'text-red-500 bg-red-50 dark:bg-red-900/30' : 'text-text-muted hover:bg-surface-alt'}`}
          aria-label={isFavorite(tool.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} className={isFavorite(tool.id) ? 'fill-current' : ''} />
        </button>
      </div>

      {tool.status === 'demo' && (
        <div className="mb-4 inline-flex items-center gap-1.5 text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-full">
          <Info size={12} /> DEMO DATA — for testing purposes only
        </div>
      )}

      {/* Tool Content */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-xl card-shadow mb-4">
        {children}
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white dark:bg-slate-800 border border-border rounded-xl card-shadow mb-4">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm text-text">Result</h3>
          </div>
          <div className="px-4 py-4">{result}</div>
        </div>
      )}

      {/* Recommendation */}
      {recommendation && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-sm text-primary mb-1">💡 Recommendation</h4>
          <p className="text-sm text-text-secondary">{recommendation}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={handleShare} className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface-alt transition-colors">
          <Share2 size={12} /> Share Result
        </button>
        <button className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface-alt transition-colors">
          <Flag size={12} /> Report
        </button>
      </div>

      {/* Related Tools */}
      {finalRelated.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text mb-2">Related Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {finalRelated.map((t) => t && (
              <Link key={t.id} to={t.path} className="flex items-center gap-2.5 p-3 bg-white dark:bg-slate-800 border border-border rounded-xl hover:card-shadow-lg transition-all">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">{getIcon(t.icon)}</div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-text truncate">{t.name}</p>
                  <p className="text-[10px] text-text-muted truncate">{t.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
