import { useState, useEffect } from 'react';
import { affiliateLinks } from '../../constants/affiliates';

interface AdBannerProps {
  category?: string;
  className?: string;
}

export default function AdBanner({ category, className = '' }: AdBannerProps) {
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const ads = category 
    ? affiliateLinks.filter(a => a.category === category)
    : affiliateLinks;

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAd(prev => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (!isVisible || ads.length === 0) return null;

  const ad = ads[currentAd % ads.length];
  if (!ad) return null;

  return (
    <div className={`relative bg-gradient-to-r from-primary/5 to-emerald-500/5 dark:from-primary/10 dark:to-emerald-500/10 border border-primary/10 dark:border-primary/20 rounded-xl overflow-hidden ${className}`}>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xs z-10"
        aria-label="Close ad"
      >
        ✕
      </button>
      
      <div className="p-4 flex items-center gap-3">
        <span className="text-2xl">{ad.logo}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recommended for you</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{ad.name}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{ad.description}</p>
        </div>
        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="shrink-0 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {ad.ctaText}
        </a>
      </div>
    </div>
  );
}
