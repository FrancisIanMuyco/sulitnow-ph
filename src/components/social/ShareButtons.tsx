interface ShareButtonsProps {
  title: string;
  url?: string;
  className?: string;
}

export default function ShareButtons({ title, url, className = '' }: ShareButtonsProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://sulitnow-ph.pages.dev');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-500/10 hover:text-blue-500',
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-sky-500/10 hover:text-sky-500',
    },
    {
      name: 'Messenger',
      icon: '💬',
      url: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=0&redirect_uri=${encodedUrl}`,
      color: 'hover:bg-indigo-500/10 hover:text-indigo-500',
    },
    {
      name: 'Viber',
      icon: '💜',
      url: `viber://forward?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-purple-500/10 hover:text-purple-500',
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-400 dark:text-gray-500">Share:</span>
      {shareLinks.map(link => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors ${link.color}`}
          title={`Share on ${link.name}`}
          aria-label={`Share on ${link.name}`}
        >
          <span className="text-sm">{link.icon}</span>
        </a>
      ))}
    </div>
  );
}
