import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

interface Earthquake {
  magnitude: number;
  place: string;
  time: number;
  depth: number | null;
  lat: number | null;
  lng: number | null;
  url: string;
  tsunami: number;
  felt: number | null;
  alert: string | null;
}

interface PriceData {
  earthquakes: Earthquake[];
  scraped_at: string;
}

function getMagColor(mag: number) {
  if (mag < 2) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
  if (mag < 3) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
  if (mag < 4) return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
  if (mag < 5) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
  return 'text-red-700 bg-red-100 dark:bg-red-900/30';
}

function getMagLabel(mag: number) {
  if (mag < 2) return 'Minor';
  if (mag < 3) return 'Light';
  if (mag < 4) return 'Moderate';
  if (mag < 5) return 'Strong';
  if (mag < 6) return 'Very Strong';
  return 'Major';
}

function getAlertColor(alert: string | null) {
  if (!alert) return '';
  if (alert === 'green') return 'border-l-4 border-l-green-500';
  if (alert === 'yellow') return 'border-l-4 border-l-yellow-500';
  if (alert === 'orange') return 'border-l-4 border-l-orange-500';
  if (alert === 'red') return 'border-l-4 border-l-red-500';
  return '';
}

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function EarthquakeMonitor() {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'm3+' | 'm4+' | 'm5+'>('all');

  useEffect(() => {
    fetch('/data/live-prices.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const quakes = data?.earthquakes || [];
  const filtered = filter === 'all' ? quakes
    : filter === 'm3+' ? quakes.filter(q => q.magnitude >= 3)
    : filter === 'm4+' ? quakes.filter(q => q.magnitude >= 4)
    : quakes.filter(q => q.magnitude >= 5);

  const maxMag = quakes.length > 0 ? Math.max(...quakes.map(q => q.magnitude || 0)) : 0;
  const lastUpdated = data?.scraped_at
    ? new Date(data.scraped_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
    : 'N/A';

  return (
    <ToolLayout
      tool={{ id: 'earthquake-monitor', name: 'Earthquake Monitor (PH)', slug: 'earthquake-monitor', description: 'Live earthquake data for the Philippines from USGS', category: 'safety', keywords: ['earthquake', 'lindol', 'quake', 'seismic', 'phivolcs', 'usgs', 'alert'], icon: 'Activity', status: 'active', path: '/tools/earthquake-monitor', requiresApi: false }}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-primary">{quakes.length}</p>
              <p className="text-xs text-gray-400">Total (7 days)</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center">
              <p className={`text-2xl font-bold ${maxMag >= 5 ? 'text-red-500' : maxMag >= 4 ? 'text-orange-500' : 'text-green-500'}`}>
                M{maxMag.toFixed(1)}
              </p>
              <p className="text-xs text-gray-400">Strongest</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{quakes.filter(q => q.magnitude >= 4).length}</p>
              <p className="text-xs text-gray-400">M4.0+</p>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400">
            🟢 Live · USGS · {lastUpdated}
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'm3+', 'm4+', 'm5+'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  filter === f ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600'
                }`}>
                {f === 'all' ? 'All' : `${f.toUpperCase()}`}
              </button>
            ))}
          </div>

          {/* Earthquake list */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg mb-1">✅ No earthquakes</p>
                <p className="text-sm">No M{filter === 'all' ? '' : filter.replace('m', '')}+ earthquakes in PH this week</p>
              </div>
            ) : (
              filtered.map((q, i) => (
                <div key={i} className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 ${getAlertColor(q.alert)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold ${getMagColor(q.magnitude)}`}>
                        <span className="text-lg">M{q.magnitude.toFixed(1)}</span>
                        <span className="text-[10px] opacity-75">{getMagLabel(q.magnitude)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{q.place}</p>
                        <p className="text-xs text-gray-400">{timeAgo(q.time)}</p>
                        {q.depth && <p className="text-xs text-gray-400">Depth: {q.depth.toFixed(1)} km</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      {q.tsunami > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🌊 Tsunami</span>
                      )}
                      {q.alert && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ml-1 ${
                          q.alert === 'green' ? 'bg-green-100 text-green-700' :
                          q.alert === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          q.alert === 'orange' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>{q.alert.toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  {q.url && (
                    <a href={q.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-primary mt-2 inline-block hover:underline">
                      View on USGS →
                    </a>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Safety tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">🆘 Earthquake Safety</h3>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• <strong>DROP, COVER, HOLD</strong> during shaking</li>
              <li>• Stay away from windows and heavy objects</li>
              <li>• If outdoors, move to open area</li>
              <li>• After shaking: check for injuries, expect aftershocks</li>
              <li>• Keep emergency kit ready (water, flashlight, first aid)</li>
              <li>• PHIVOLCS hotline: (02) 8426-1468 to 79</li>
            </ul>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
