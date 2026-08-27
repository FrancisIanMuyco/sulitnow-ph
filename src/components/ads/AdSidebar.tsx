import { affiliateLinks } from '../../constants/affiliates';

interface AdSidebarProps {
  count?: number;
  className?: string;
}

export default function AdSidebar({ count = 3, className = '' }: AdSidebarProps) {
  const ads = affiliateLinks.slice(0, count);

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Recommended</p>
      {ads.map(ad => (
        <a
          key={ad.id}
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:border-primary/30 dark:hover:border-primary/40 transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{ad.logo}</span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{ad.name}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{ad.description}</p>
        </a>
      ))}
      <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">Affiliate disclosure: We may earn a commission</p>
    </div>
  );
}
