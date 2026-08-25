import { ExternalLink } from 'lucide-react';

interface AffiliateCardProps {
  title: string;
  description: string;
  url?: string;
  category?: string;
}

export default function AffiliateCard({ title, description, url, category }: AffiliateCardProps) {
  if (!url) return null; // Don't show if no affiliate link

  return (
    <div className="border border-border rounded-xl p-4 bg-surface-alt">
      <div className="flex items-start justify-between gap-3">
        <div>
          {category && <span className="text-[10px] text-text-muted uppercase tracking-wide">{category}</span>}
          <h4 className="text-sm font-medium text-text mt-0.5">{title}</h4>
          <p className="text-xs text-text-muted mt-1">{description}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="shrink-0 text-primary hover:text-primary-dark transition-colors"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
