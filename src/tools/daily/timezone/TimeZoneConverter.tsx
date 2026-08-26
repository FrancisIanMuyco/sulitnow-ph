import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

const TIMEZONES = [
  { id: 'PHT', label: 'Philippines (PHT)', offset: 8, flag: '🇵🇭' },
  { id: 'SGT', label: 'Singapore (SGT)', offset: 8, flag: '🇸🇬' },
  { id: 'JST', label: 'Japan (JST)', offset: 9, flag: '🇯🇵' },
  { id: 'KST', label: 'South Korea (KST)', offset: 9, flag: '🇰🇷' },
  { id: 'CST', label: 'China (CST)', offset: 8, flag: '🇨🇳' },
  { id: 'HKT', label: 'Hong Kong (HKT)', offset: 8, flag: '🇭🇰' },
  { id: 'TW', label: 'Taiwan (CST)', offset: 8, flag: '🇹🇼' },
  { id: 'AEST', label: 'Australia East (AEST)', offset: 10, flag: '🇦🇺' },
  { id: 'NZST', label: 'New Zealand (NZST)', offset: 12, flag: '🇳🇿' },
  { id: 'PST', label: 'US West (PST)', offset: -8, flag: '🇺🇸' },
  { id: 'MST', label: 'US Mountain (MST)', offset: -7, flag: '🇺🇸' },
  { id: 'CST_US', label: 'US Central (CST)', offset: -6, flag: '🇺🇸' },
  { id: 'EST', label: 'US East (EST)', offset: -5, flag: '🇺🇸' },
  { id: 'GMT', label: 'UK (GMT)', offset: 0, flag: '🇬🇧' },
  { id: 'CET', label: 'Europe Central (CET)', offset: 1, flag: '🇩🇪' },
  { id: 'IST', label: 'India (IST)', offset: 5.5, flag: '🇮🇳' },
  { id: 'GST', label: 'Dubai (GST)', offset: 4, flag: '🇦🇪' },
  { id: 'SA', label: 'Saudi Arabia (AST)', offset: 3, flag: '🇸🇦' },
  { id: 'SG', label: 'Singapore (SGT)', offset: 8, flag: '🇸🇬' },
  { id: 'MY', label: 'Malaysia (MYT)', offset: 8, flag: '🇲🇾' },
  { id: 'TH', label: 'Thailand (ICT)', offset: 7, flag: '🇹🇭' },
  { id: 'VN', label: 'Vietnam (ICT)', offset: 7, flag: '🇻🇳' },
  { id: 'ID', label: 'Indonesia (WIB)', offset: 7, flag: '🇮🇩' },
];

export default function TimeZoneConverter() {
  const [phHour, setPhHour] = useState(new Date().getHours());
  const [phMinute, setPhMinute] = useState(new Date().getMinutes());
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['JST', 'EST', 'GMT', 'SGT']);

  const toggleTimezone = (id: string) => {
    setSelectedTimezones(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const getConvertedTime = (offset: number) => {
    const phOffset = 8;
    const diff = offset - phOffset;
    let h = phHour + diff;
    let m = phMinute;
    // Handle half-hour offsets
    if (offset % 1 !== 0) {
      m += (offset % 1) * 60;
    }
    while (h >= 24) h -= 24;
    while (h < 0) h += 24;
    while (m >= 60) { h += 1; m -= 60; }
    while (m < 0) { h -= 1; m += 60; }
    return { hour: h, minute: m };
  };

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const isWorkHour = (h: number) => h >= 9 && h < 18;
  const isSleepHour = (h: number) => h >= 22 || h < 6;

  return (
    <ToolLayout
      tool={{ id: 'time-zone-converter', name: 'Time Zone Converter', slug: 'time-zone-converter', description: 'Convert Philippine time to other countries — for OFWs and freelancers', category: 'daily', keywords: ['time', 'zone', 'ofw', 'freelancer', 'clock'], icon: 'Clock', status: 'active', path: '/tools/time-zone-converter', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">🇵🇭 Philippine Time (PHT)</label>
          <div className="flex gap-2">
            <select value={phHour} onChange={(e) => setPhHour(parseInt(e.target.value))}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i === 0 ? 12 : i > 12 ? i - 12 : i} {i >= 12 ? 'PM' : 'AM'}</option>
              ))}
            </select>
            <span className="self-center text-xl font-bold">:</span>
            <select value={phMinute} onChange={(e) => setPhMinute(parseInt(e.target.value))}
              className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {[0, 15, 30, 45].map(m => (
                <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Countries</label>
          <div className="flex flex-wrap gap-1">
            {TIMEZONES.filter((tz, i, arr) => arr.findIndex(t => t.id === tz.id) === i).map((tz) => (
              <button key={`${tz.id}-${tz.label}`} onClick={() => toggleTimezone(tz.id)}
                className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                  selectedTimezones.includes(tz.id)
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                }`}>
                {tz.flag} {tz.id}
              </button>
            ))}
          </div>
        </div>

        {/* Converted times */}
        <div className="space-y-2">
          {TIMEZONES
            .filter(tz => selectedTimezones.includes(tz.id))
            .filter((tz, i, arr) => arr.findIndex(t => t.id === tz.id) === i)
            .map((tz) => {
              const time = getConvertedTime(tz.offset);
              return (
                <div key={`${tz.id}-${tz.label}`}
                  className={`flex justify-between items-center px-4 py-3 rounded-xl border ${
                    isSleepHour(time.hour)
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                      : isWorkHour(time.hour)
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                  <div>
                    <span className="text-lg mr-2">{tz.flag}</span>
                    <span className="text-sm font-medium">{tz.label}</span>
                    {isSleepHour(time.hour) && <span className="text-xs ml-2 text-indigo-500">😴 Night</span>}
                    {isWorkHour(time.hour) && <span className="text-xs ml-2 text-green-600">💼 Work hours</span>}
                  </div>
                  <span className="text-lg font-bold">{formatTime(time.hour, time.minute)}</span>
                </div>
              );
            })}
        </div>

        {/* OFW Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
          <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">📱 OFW Tips</h3>
          <ul className="space-y-1 text-blue-700 dark:text-blue-300">
            <li>• 🟢 Best time to call PH from abroad: 6 AM - 9 PM PHT</li>
            <li>• 🟡 US East Coast: PH evening = US morning</li>
            <li>• 🔴 Middle East: PH midnight = afternoon (3-4 hr diff)</li>
            <li>• 📞 Schedule calls during both parties' daytime</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
