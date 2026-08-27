import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface VisitorCounterProps {
  className?: string;
}

export default function VisitorCounter({ className = '' }: VisitorCounterProps) {
  const [totalViews, setTotalViews] = useState<number>(0);
  const [todayViews, setTodayViews] = useState<number>(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const storageKey = 'sulitnow_views';
    const todayKey = 'sulitnow_today';
    const todayDateKey = 'sulitnow_today_date';

    // Get stored data
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{"total":847,"base":847}');
    const todayStored = JSON.parse(localStorage.getItem(todayKey) || '{"count":0}');
    const storedDate = localStorage.getItem(todayDateKey) || '';

    // Reset today count if new day
    if (storedDate !== today) {
      const newToday = { count: 1 };
      localStorage.setItem(todayKey, JSON.stringify(newToday));
      localStorage.setItem(todayDateKey, today);
      setTodayViews(1);
    } else {
      todayStored.count += 1;
      localStorage.setItem(todayKey, JSON.stringify(todayStored));
      setTodayViews(todayStored.count);
    }

    // Increment total
    stored.total += 1;
    localStorage.setItem(storageKey, JSON.stringify(stored));
    setTotalViews(stored.total);
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 ${className}`}>
      <div className="relative">
        <Users size={14} className="text-white/80" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>
      <div className="text-xs text-white/90">
        <span className="font-semibold">{totalViews.toLocaleString()}</span> total views
        {todayViews > 0 && (
          <span className="text-white/60 ml-1.5">· {todayViews} today</span>
        )}
      </div>
    </div>
  );
}
