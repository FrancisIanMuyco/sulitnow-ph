import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

const VOLCANOES = [
  { name: 'Mayon Volcano', location: 'Albay, Bicol', elevation: '2,462m', type: 'Stratovolcano', status: 'Alert Level 1', color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', description: 'Normal unrest in background seismicity. Phreatic eruptions possible.' },
  { name: 'Taal Volcano', location: 'Batangas, Calabarzon', elevation: '311m', type: 'Caldera', status: 'Alert Level 1', color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', description: 'Low-level unrest. Steam/gas emissions from main crater.' },
  { name: 'Bulusan Volcano', location: 'Sorsogon, Bicol', elevation: '1,565m', type: 'Stratovolcano', status: 'Alert Level 0', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', description: 'Normal background condition. No imminent eruption.' },
  { name: 'Kanlaon Volcano', location: 'Negros Island', elevation: '2,435m', type: 'Stratovolcano', status: 'Alert Level 2', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20', description: 'Moderate unrest. Magmatic intrusion may lead to eruption.' },
  { name: 'Smith Volcano', location: 'Babuyan Islands, Cagayan', elevation: '688m', type: 'Stratovolcano', status: 'Alert Level 0', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', description: 'No abnormal activity.' },
  { name: 'Hibok-Hibok Volcano', location: 'Camiguin Island', elevation: '1,332m', type: 'Stratovolcano', status: 'Alert Level 0', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', description: 'Normal background condition.' },
  { name: 'Pinatubo Volcano', location: 'Zambales/Tarlac', elevation: '1,486m', type: 'Stratovolcano', status: 'Alert Level 0', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', description: 'Normal. Last major eruption 1991.' },
];

const ALERT_LEVELS = [
  { level: 0, label: 'Normal', color: 'text-green-500', bg: 'bg-green-500', description: 'No imminent eruption. Normal background seismicity.' },
  { level: 1, label: 'Low Level Unrest', color: 'text-yellow-500', bg: 'bg-yellow-500', description: 'Slight increase in seismic activity. Phreatic eruptions possible.' },
  { level: 2, label: 'Moderate Unrest', color: 'text-orange-500', bg: 'bg-orange-500', description: 'Magmatic intrusion may lead to eruption. Danger zone may be extended.' },
  { level: 3, label: 'High Unrest', color: 'text-red-500', bg: 'bg-red-500', description: 'Intense unrest. Eruption possible within weeks.' },
  { level: 4, label: 'Hazardous Eruption Imminent', color: 'text-red-700', bg: 'bg-red-700', description: 'Hazardous eruption possible within hours to days.' },
  { level: 5, label: 'Hazardous Eruption in Progress', color: 'text-red-900', bg: 'bg-red-900', description: 'Dangerous eruption underway. Evacuate immediately.' },
];

export default function VolcanoStatus() {
  const [lastUpdated] = useState('August 2026 (PHIVOLCS advisory)');

  return (
    <ToolLayout
      tool={{ id: 'volcano-status', name: 'Philippine Volcano Status', slug: 'volcano-status', description: 'Current alert levels for active Philippine volcanoes from PHIVOLCS', category: 'safety', keywords: ['volcano', 'mayon', 'taal', 'pinatubo', 'bulusan', 'phivolcs', 'alert', 'eruption'], icon: 'Mountain', status: 'active', path: '/tools/volcano-status', requiresApi: false }}
    >
      <div className="space-y-4">
        <div className="text-center text-xs text-gray-400">
          🟢 Data from PHIVOLCS · {lastUpdated}
        </div>

        {/* Alert Level Legend */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-2">📡 PHIVOLCS Alert Levels</h3>
          <div className="space-y-1">
            {ALERT_LEVELS.map(a => (
              <div key={a.level} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-full ${a.bg}`} />
                <span className="font-medium w-4"> {a.level}</span>
                <span className={`font-medium ${a.color}`}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Volcano list */}
        <div className="space-y-2">
          {VOLCANOES.map(v => {
            const alertLevel = parseInt(v.status.match(/\d+/)?.[0] || '0');
            return (
              <div key={v.name} className={`${v.bgColor} border border-gray-200 dark:border-gray-700 rounded-xl p-4`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌋</span>
                      <span className="font-semibold text-sm">{v.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{v.location} · {v.elevation} · {v.type}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${v.color} bg-white dark:bg-gray-800`}>
                    {v.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{v.description}</p>
                {alertLevel >= 2 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                    <span>⚠️</span>
                    <span className="font-medium">Danger zone: {alertLevel >= 4 ? '8-10 km' : '4-6 km'} radius from summit</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Safety tips */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm">
          <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">🆘 Volcanic Emergency</h3>
          <ul className="space-y-1 text-red-700 dark:text-red-300">
            <li>• <strong>PHIVOLCS hotline:</strong> (02) 8426-1468 to 79</li>
            <li>• Evacuate immediately if Alert Level 4-5</li>
            <li>• Stay away from rivers and lahar-prone areas</li>
            <li>• Wear mask/goggles during ashfall</li>
            <li>• Cover water containers during ashfall</li>
            <li>• Monitor PHIVOLCS Facebook/Twitter for updates</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
