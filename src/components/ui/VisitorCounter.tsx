import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface VisitorCounterProps {
  className?: string;
}

export default function VisitorCounter({ className = '' }: VisitorCounterProps) {
  const [count, setCount] = useState<number | null>(null);
  const [todayCount, setTodayCount] = useState<number | null>(null);

  useEffect(() => {
    // Increment total count and get current value
    fetch('https://api.counterapi.dev/v1/sulitnow-ph/up')
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {});

    // Today's visitors
    fetch('https://api.counterapi.dev/v1/sulitnow-ph-today/up')
      .then(r => r.json())
      .then(d => setTodayCount(d.count))
      .catch(() => {});
  }, []);

  // Update today count every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://api.counterapi.dev/v1/sulitnow-ph-today/get')
        .then(r => r.json())
        .then(d => setTodayCount(d.count))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (count === null) return null;

  return (
    <div className={`inline-flex items-center gap-2 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 ${className}`}>
      <div className="relative">
        <Users size={14} className="text-white/80" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>
      <div className="text-xs text-white/90">
        <span className="font-semibold">{count.toLocaleString()}</span> total views
        {todayCount !== null && todayCount > 0 && (
          <span className="text-white/60 ml-1.5">· {todayCount} today</span>
        )}
      </div>
    </div>
  );
}
