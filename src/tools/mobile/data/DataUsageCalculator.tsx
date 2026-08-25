import { useState } from 'react';
import { toolRegistry } from '../../../constants/toolRegistry';
import ToolLayout from '../../../components/tool/ToolLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatNumber } from '../../../utils/format';

const activities = [
  { id: 'browse', name: 'Web Browsing', mbPerHour: 60 },
  { id: 'social', name: 'Social Media', mbPerHour: 150 },
  { id: 'video-sd', name: 'Video (SD)', mbPerHour: 700 },
  { id: 'video-hd', name: 'Video (HD)', mbPerHour: 3000 },
  { id: 'video-fhd', name: 'Video (FHD)', mbPerHour: 7000 },
  { id: 'music', name: 'Music Streaming', mbPerHour: 100 },
  { id: 'gaming', name: 'Online Gaming', mbPerHour: 120 },
  { id: 'call', name: 'Video Call', mbPerHour: 500 },
  { id: 'download', name: 'File Downloads', mbPerHour: 5000 },
];

export default function DataUsageCalculator() {
  const tool = toolRegistry.find((t) => t.id === 'data-usage-calculator')!;
  const [hours, setHours] = useState<Record<string, number>>({});
  const [days, setDays] = useState('30');
  const [result, setResult] = useState<{
    dailyMB: number;
    monthlyMB: number;
    monthlyGB: number;
    breakdown: { name: string; mb: number; percent: number }[];
  } | null>(null);

  const handleCalculate = () => {
    const numDays = parseInt(days) || 30;
    let totalMBPerDay = 0;
    const breakdown: { name: string; mb: number; percent: number }[] = [];

    for (const act of activities) {
      const h = hours[act.id] || 0;
      if (h > 0) {
        const mb = h * act.mbPerHour;
        totalMBPerDay += mb;
        breakdown.push({ name: act.name, mb, percent: 0 });
      }
    }

    if (totalMBPerDay === 0) return;

    // Calculate percentages
    breakdown.forEach((b) => {
      b.percent = (b.mb / totalMBPerDay) * 100;
    });

    breakdown.sort((a, b) => b.mb - a.mb);

    const monthlyMB = totalMBPerDay * numDays;

    setResult({
      dailyMB: totalMBPerDay,
      monthlyMB,
      monthlyGB: monthlyMB / 1024,
      breakdown,
    });
  };

  return (
    <ToolLayout
      tool={tool}
      recommendation={result ? `You need approximately ${formatNumber(result.monthlyGB)} GB of data per month. Consider a promo with at least ${Math.ceil(result.monthlyGB)} GB.` : undefined}
    >
      <div className="px-4 py-4 space-y-4">
        <p className="text-xs text-text-secondary">Enter estimated daily hours for each activity:</p>

        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <span className="text-sm text-text">{act.name}</span>
              <span className="text-[10px] text-text-muted ml-1">({act.mbPerHour} MB/hr)</span>
            </div>
            <input
              type="number"
              value={hours[act.id] || ''}
              onChange={(e) => setHours({ ...hours, [act.id]: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className="w-20 px-2 py-1.5 text-xs text-right rounded-lg border border-border bg-white dark:bg-slate-800 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-[10px] text-text-muted w-6">hrs</span>
          </div>
        ))}

        <Input
          label="Days per month"
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="30"
        />

        <Button onClick={handleCalculate} className="w-full">
          Calculate Usage
        </Button>
      </div>

      {result && (
        <div className="border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-primary font-medium mb-1">Estimated Monthly Data</p>
              <p className="text-2xl font-bold text-primary">{formatNumber(result.monthlyGB)} GB</p>
              <p className="text-xs text-text-muted mt-1">≈ {formatNumber(result.dailyMB)} MB per day</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text mb-2">Breakdown</h4>
              {result.breakdown.map((b) => (
                <div key={b.name} className="mb-2">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-text-secondary">{b.name}</span>
                    <span className="text-text">{formatNumber(b.mb)} MB ({formatNumber(b.percent)}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-alt rounded-full">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${b.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
