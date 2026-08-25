import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { toolRegistry } from '../../../constants/toolRegistry';
import { Wallet } from 'lucide-react';

const tool = toolRegistry.find(t => t.id === 'mobile-data-budget')!;

const USAGES = [
  { activity: 'Browse Social Media (1hr)', mb: 200 },
  { activity: 'Watch YouTube (1hr, SD)', mb: 700 },
  { activity: 'Watch YouTube (1hr, HD)', mb: 2500 },
  { activity: 'Video Call (1hr)', mb: 500 },
  { activity: 'Listen to Music Streaming (1hr)', mb: 100 },
  { activity: 'Browse Web (1hr)', mb: 50 },
  { activity: 'Download App (100MB)', mb: 100 },
  { activity: 'Play Online Game (1hr)', mb: 150 },
  { activity: 'Messaging (1hr)', mb: 30 },
  { activity: 'TikTok/Reels (1hr)', mb: 350 },
];

export default function MobileDataBudget() {
  const [loadBudget, setLoadBudget] = useState('');
  const [activities, setActivities] = useState(USAGES.map(u => ({ ...u, hoursPerDay: 0 })));

  const totalMBPerDay = activities.reduce((sum, a) => sum + a.mb * a.hoursPerDay, 0);
  const totalMBPerMonth = totalMBPerDay * 30;
  const totalGBPerMonth = totalMBPerMonth / 1024;

  const updateHours = (i: number, val: string) => {
    const newActivities = [...activities];
    newActivities[i].hoursPerDay = parseFloat(val) || 0;
    setActivities(newActivities);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="p-4 space-y-4">
        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text">Mobile Data Budget</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Monthly Load/Data Budget (₱)</label>
              <input type="number" value={loadBudget} onChange={e => setLoadBudget(e.target.value)} placeholder="e.g. 500" className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </div>

        <div className="bg-surface-alt rounded-xl p-4 border border-border">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Your Daily Usage (hours/day)</h4>
          <div className="space-y-2">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-xs text-text flex-1">{a.activity}</span>
                <span className="text-[10px] text-text-muted w-16 text-right">{a.mb}MB/hr</span>
                <input type="number" min={0} max={24} step={0.5} value={a.hoursPerDay || ''} onChange={e => updateHours(i, e.target.value)} placeholder="0" className="w-14 px-2 py-1 rounded bg-surface border border-border text-text text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            ))}
          </div>
        </div>

        {totalMBPerDay > 0 && (
          <div className="bg-surface-alt rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Your Data Usage Estimate</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-text-muted">Daily Usage</span><span className="text-text font-medium">{totalMBPerDay >= 1024 ? (totalMBPerDay / 1024).toFixed(1) + ' GB' : totalMBPerDay.toFixed(0) + ' MB'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Monthly Usage (30 days)</span><span className="text-lg font-bold text-primary">{totalGBPerMonth.toFixed(1)} GB</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Annual Usage</span><span className="text-base font-bold text-text">{(totalGBPerMonth * 12).toFixed(1)} GB</span></div>
            </div>
            <div className="mt-3 p-3 bg-surface rounded-lg border border-border text-xs text-text-muted">
              📱 Recommended plan: Get at least <span className="font-semibold text-primary">{Math.ceil(totalGBPerMonth)} GB/month</span> promo to cover your usage.
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
