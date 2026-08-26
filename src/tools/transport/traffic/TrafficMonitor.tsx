import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

const EXPRESSWAYS = [
  { name: 'NLEX', fullName: 'North Luzon Expressway', route: 'Manila → Clark/CGE', length: '84 km', toll: '₱205-357', icon: '🛣️' },
  { name: 'SLEX', fullName: 'South Luzon Expressway', route: 'Manila → Batangas/CALABARZON', length: '56 km', toll: '₱156-312', icon: '🛣️' },
  { name: 'Skyway', fullName: 'Skyway Stage 3', route: 'Bicutan → Balintawak', length: '19 km', toll: '₱55-309', icon: '🏗️' },
  { name: 'CAVITEX', fullName: 'Manila-Cavite Expressway', route: 'Roxas Blvd → Kawit', length: '14 km', toll: '₱48-96', icon: '🛣️' },
  { name: 'CALAX', fullName: 'Cavite-Laguna Expressway', route: 'Kawit → Laguna', length: '45 km', toll: '₱100-250', icon: '🛣️' },
  { name: 'NLEX Connector', fullName: 'NLEX Connector Road', route: 'Caloocan → NLEX', length: '8 km', toll: '₱50-120', icon: '🏗️' },
];

const EDSA_ROUTES = [
  { from: 'Cubao', to: 'Makati', distance: '9 km', jeepney: '₱13-15', mrt: '₱13-20', motor: '₱50-80', car: '₱150-250' },
  { from: 'Monumento', to: 'Ayala', distance: '16 km', jeepney: '₱15-20', mrt: '₱20-28', motor: '₱80-120', car: '₱250-400' },
  { from: 'Cubao', to: 'Ortigas', distance: '6 km', jeepney: '₱13', mrt: '₱13-16', motor: '₱40-60', car: '₱100-180' },
  { from: 'Baclaran', to: 'SM North', distance: '22 km', jeepney: '₱20-25', mrt: '₱28-35', motor: '₱120-180', car: '₱350-500' },
  { from: 'PITX', to: 'Cubao', distance: '18 km', jeepney: '₱18-22', mrt: '₱24-32', motor: '₱100-150', car: '₱300-450' },
];

const TRAFFIC_TIPS = [
  { time: '6:00-9:00 AM', level: '🔴 Heavy', tip: 'Peak morning rush. EDSA, C5 heavily congested. Use MRT/LRT.' },
  { time: '9:00-11:00 AM', level: '🟡 Moderate', tip: 'Traffic easing. Good window for errands.' },
  { time: '11:00-2:00 PM', level: '🟢 Light', tip: 'Midday low. Best time for meetings/travel.' },
  { time: '2:00-4:00 PM', level: '🟡 Moderate', tip: 'Building up. School dismissal adds volume.' },
  { time: '4:00-8:00 PM', level: '🔴 Heavy', tip: 'Peak evening rush. Worst 5-7 PM. Avoid EDSA.' },
  { time: '8:00-11:00 PM', level: '🟢 Light', tip: 'Traffic clearing. Good for late travel.' },
  { time: '11:00-6:00 AM', level: '🟢 Clear', tip: 'Night hours. Minimal traffic. Expressways open.' },
];

export default function TrafficMonitor() {
  const [activeTab, setActiveTab] = useState<'expressways' | 'commute' | 'schedule'>('expressways');

  const now = new Date();
  const phTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
  const hour = phTime.getHours();

  const currentSchedule = TRAFFIC_TIPS.find(t => {
    const [start, end] = t.time.match(/(\d+):(\d+)/g) || [];
    if (!start || !end) return false;
    const startH = parseInt(start.split(':')[0]);
    const endH = parseInt(end.split(':')[0]);
    if (endH < startH) return hour >= startH || hour < endH;
    return hour >= startH && hour < endH;
  }) || TRAFFIC_TIPS[TRAFFIC_TIPS.length - 1];

  return (
    <ToolLayout
      tool={{ id: 'traffic-monitor', name: 'Metro Manila Traffic Monitor', slug: 'traffic-monitor', description: 'Expressway tolls, commute costs, and traffic schedule for Metro Manila', category: 'daily', keywords: ['traffic', 'commute', 'nlex', 'slex', 'edsa', 'mrt', 'expressway', 'toll', 'biyahe'], icon: 'MapPin', status: 'active', path: '/tools/traffic-monitor', requiresApi: false }}
    >
      <div className="space-y-4">
        {/* Current traffic status */}
        <div className={`${currentSchedule.level.includes('Heavy') ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : currentSchedule.level.includes('Moderate') ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'} border rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🚦</span>
            <span className="font-semibold text-sm">Current Traffic: {currentSchedule.level}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{currentSchedule.tip}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {([
            { key: 'expressways', label: '🛣️ Expressways' },
            { key: 'commute', label: '🚌 Commute' },
            { key: 'schedule', label: '⏰ Schedule' },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                activeTab === t.key ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Expressways */}
        {activeTab === 'expressways' && (
          <div className="space-y-2">
            {EXPRESSWAYS.map(e => (
              <div key={e.name} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{e.icon}</span>
                      <span className="font-semibold text-sm">{e.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{e.fullName}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{e.toll}</span>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>📍 {e.route}</span>
                  <span>📏 {e.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Commute comparison */}
        {activeTab === 'commute' && (
          <div className="space-y-2">
            {EDSA_ROUTES.map((r, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{r.from} → {r.to}</span>
                    <span className="text-xs text-gray-400">{r.distance}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700">
                  <div className="p-2 text-center">
                    <p className="text-[10px] text-gray-400">🚌 Jeepney</p>
                    <p className="text-sm font-bold text-green-600">{r.jeepney}</p>
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-[10px] text-gray-400">🚇 MRT</p>
                    <p className="text-sm font-bold text-blue-600">{r.mrt}</p>
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-[10px] text-gray-400">🏍️ Motorcycle</p>
                    <p className="text-sm font-bold text-orange-600">{r.motor}</p>
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-[10px] text-gray-400">🚗 Car</p>
                    <p className="text-sm font-bold text-red-600">{r.car}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Traffic schedule */}
        {activeTab === 'schedule' && (
          <div className="space-y-2">
            {TRAFFIC_TIPS.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                t === currentSchedule ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}>
                <div className="w-24 text-xs font-medium">{t.time}</div>
                <div className="flex-1">
                  <span className="text-sm font-medium">{t.level}</span>
                  <p className="text-xs text-gray-400">{t.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
          <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">💡 Commute Tips</h3>
          <ul className="space-y-1 text-blue-700 dark:text-blue-300">
            <li>• Use MRT/LRT for EDSA commute — cheaper and faster</li>
            <li>• Beep card works on all LRT/MRT lines</li>
            <li>• Book Grab/Angkas before rush hour for better rates</li>
            <li>• NLEX/SLEX — get RFID (Autosweep/RFID) for faster toll</li>
            <li>• Check Waze/Google Maps for real-time traffic</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
