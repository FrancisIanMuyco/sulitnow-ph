import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

const PH_CITIES = [
  { name: 'Metro Manila', lat: 14.5995, lng: 120.9842 },
  { name: 'Quezon City', lat: 14.6760, lng: 121.0437 },
  { name: 'Makati', lat: 14.5547, lng: 121.0500 },
  { name: 'Cebu City', lat: 10.3157, lng: 123.8854 },
  { name: 'Davao City', lat: 7.1907, lng: 125.4553 },
  { name: 'Zamboanga City', lat: 6.9214, lng: 122.0790 },
  { name: 'Iloilo City', lat: 10.7202, lng: 122.5621 },
  { name: 'Bacolod City', lat: 10.6769, lng: 122.9523 },
  { name: 'Tacloban City', lat: 11.2421, lng: 124.9930 },
  { name: 'Baguio City', lat: 16.4023, lng: 120.5960 },
  { name: 'General Santos', lat: 6.1164, lng: 125.1716 },
  { name: 'Olongapo City', lat: 14.8387, lng: 120.2840 },
];

interface AQIData {
  us_aqi: number;
  pm2_5: number;
  pm10: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
  ozone: number;
  time: string;
}

function getAQILevel(aqi: number) {
  if (aqi <= 50) return { label: 'Good', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', icon: '😊', advice: 'Air quality is satisfactory. Enjoy outdoor activities!' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', icon: '😐', advice: 'Acceptable. Unusually sensitive people should limit prolonged outdoor exertion.' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', icon: '😷', advice: 'Sensitive groups may experience health effects. Limit prolonged outdoor exertion.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: '🚨', advice: 'Everyone may begin to experience health effects. Avoid prolonged outdoor exertion.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', icon: '⚠️', advice: 'Health alert: everyone may experience serious health effects.' };
  return { label: 'Hazardous', color: 'text-red-800', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-300 dark:border-red-700', icon: '☠️', advice: 'Emergency conditions. Avoid all outdoor activities.' };
}

export default function AirQualityChecker() {
  const [city, setCity] = useState(PH_CITIES[0]);
  const [data, setData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAQI = async (c: typeof PH_CITIES[0]) => {
    setCity(c);
    setLoading(true);
    setError('');
    try {
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${c.lat}&longitude=${c.lng}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=Asia/Manila`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json.current);
    } catch {
      setError('Failed to fetch air quality data');
    }
    setLoading(false);
  };

  const level = data ? getAQILevel(data.us_aqi) : null;

  return (
    <ToolLayout
      tool={{ id: 'air-quality-checker', name: 'Air Quality Checker', slug: 'air-quality', description: 'Check real-time air quality index for Philippine cities', category: 'daily', keywords: ['air', 'quality', 'aqi', 'pollution', 'pm2.5', 'hangin', 'kalidad'], icon: 'Wind', status: 'active', path: '/tools/air-quality', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select City</label>
          <div className="grid grid-cols-2 gap-2">
            {PH_CITIES.map((c) => (
              <button key={c.name} onClick={() => fetchAQI(c)}
                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors text-left ${
                  city.name === c.name && data ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                }`}>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="text-center text-red-500 text-sm">{error}</p>}

        {data && level && (
          <div className="space-y-4">
            {/* AQI Card */}
            <div className={`${level.bg} ${level.border} border rounded-xl p-6 text-center`}>
              <p className="text-4xl mb-2">{level.icon}</p>
              <p className="text-sm text-gray-500 mb-1">Air Quality Index</p>
              <p className={`text-5xl font-bold ${level.color}`}>{data.us_aqi}</p>
              <p className={`text-lg font-semibold ${level.color} mt-1`}>{level.label}</p>
              <p className="text-sm text-gray-500 mt-2">{city.name}</p>
            </div>

            {/* Advice */}
            <div className={`${level.bg} border ${level.border} rounded-xl p-4 text-sm`}>
              <p className={`font-medium ${level.color}`}>💡 Health Advice</p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{level.advice}</p>
            </div>

            {/* Pollutant breakdown */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-sm">📊 Pollutant Levels</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { label: 'PM2.5 (Fine particles)', value: data.pm2_5, unit: 'μg/m³', safe: 25 },
                  { label: 'PM10 (Coarse particles)', value: data.pm10, unit: 'μg/m³', safe: 50 },
                  { label: 'Ozone (O₃)', value: data.ozone, unit: 'μg/m³', safe: 100 },
                  { label: 'Nitrogen Dioxide (NO₂)', value: data.nitrogen_dioxide, unit: 'μg/m³', safe: 100 },
                  { label: 'Sulfur Dioxide (SO₂)', value: data.sulphur_dioxide, unit: 'μg/m³', safe: 100 },
                  { label: 'Carbon Monoxide (CO)', value: data.carbon_monoxide, unit: 'μg/m³', safe: 10000 },
                ].map((p) => (
                  <div key={p.label} className="px-4 py-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{p.label}</span>
                      <span className={`font-medium text-sm ${p.value > p.safe ? 'text-red-500' : 'text-green-500'}`}>
                        {p.value?.toFixed(1)} {p.unit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${p.value > p.safe ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, (p.value / p.safe) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AQI Scale */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-2">📏 AQI Scale (US EPA)</h3>
              <div className="space-y-1 text-xs">
                {[
                  { range: '0-50', label: 'Good', color: 'bg-green-500' },
                  { range: '51-100', label: 'Moderate', color: 'bg-yellow-500' },
                  { range: '101-150', label: 'Unhealthy (Sensitive)', color: 'bg-orange-500' },
                  { range: '151-200', label: 'Unhealthy', color: 'bg-red-500' },
                  { range: '201-300', label: 'Very Unhealthy', color: 'bg-purple-500' },
                  { range: '301+', label: 'Hazardous', color: 'bg-red-800' },
                ].map(s => (
                  <div key={s.range} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${s.color}`} />
                    <span className="w-16 font-medium">{s.range}</span>
                    <span className="text-gray-500">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
