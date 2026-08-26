import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { searchTools, type SearchResult } from '../../utils/search';
import { toolRegistry } from '../../constants/toolRegistry';
import { getIcon } from '../../utils/iconMap';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const matchTypeBadge: Record<string, { label: string; color: string }> = {
  exact: { label: 'Exact', color: 'bg-green-100 text-green-700' },
  partial: { label: 'Match', color: 'bg-blue-100 text-blue-700' },
  alias: { label: 'Related', color: 'bg-purple-100 text-purple-700' },
  fuzzy: { label: 'Similar', color: 'bg-yellow-100 text-yellow-700' },
};

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchTools(toolRegistry, query));
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={18} className="text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools... e.g. 'salary', 'GCash', 'load', 'fuel'"
            className="flex-1 bg-transparent outline-none text-sm text-text placeholder:text-text-muted"
          />
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-alt">
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        {query.length < 2 && (
          <div className="px-4 py-6 text-center text-sm text-text-muted">
            <p>Type at least 2 characters to search</p>
            <p className="text-xs mt-2 text-text-muted/70">
              Try: "sweldo" "GCash" "load" "gasolina" "discount"
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto py-2">
            {results.map((result) => {
              const badge = matchTypeBadge[result.matchType];
              return (
                <button
                  key={result.tool.id}
                  onClick={() => handleSelect(result.tool.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-alt transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {getIcon(result.tool.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text truncate">{result.tool.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted truncate">{result.tool.description}</p>
                  </div>
                  <ArrowRight size={14} className="text-text-muted shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-text-muted">
            No tools found for "{query}"
            <p className="text-xs mt-2">Try different keywords or check spelling</p>
          </div>
        )}
      </div>
    </div>
  );
}
