import { useState, useEffect } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function WeatherChecker() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/data/weather.json')
      .then(r => r.json())
      .then(d => { setWeather(d); setLoading(false); })
      .catch(() => { setError('Unable to load weather data'); setLoading(false); });
  }, []);

  return (
    <ToolLayout
      tool={{ id: 'weather-checker', name: 'PAGASA Weather Checker', slug: 'weather-checker', description: 'Check current Philippine weather conditions, typhoon signals, and forecasts from PAGASA.', category: 'daily', keywords: [], icon: 'CloudRain', status: 'active', path: '/tools/weather-checker', requiresApi: false }}
    >
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 text-center border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <a href="https://www.pagasa.dost.gov.ph/" target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-emerald-600 dark:text-emerald-400 underline">
            Visit PAGASA directly →
          </a>
        </div>
      ) : weather && (
        <div className="space-y-5">
          {/* Current Conditions */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-80 mb-1">Current Weather — Philippines</p>
            <div className="flex items-center gap-4 mt-3">
              {weather.temperature && (
                <div>
                  <p className="text-3xl font-bold">{weather.temperature}</p>
                  <p className="text-xs opacity-70">Temperature</p>
                </div>
              )}
              {weather.windSpeed && (
                <div>
                  <p className="text-xl font-semibold">💨 {weather.windSpeed}</p>
                  <p className="text-xs opacity-70">Wind Speed</p>
                </div>
              )}
              {weather.humidity && (
                <div>
                  <p className="text-xl font-semibold">💧 {weather.humidity}</p>
                  <p className="text-xs opacity-70">Humidity</p>
                </div>
              )}
            </div>
            <p className="text-xs opacity-60 mt-3">Source: {weather.source || 'PAGASA'} · Updated: {new Date(weather.lastUpdated).toLocaleString('en-PH')}</p>
          </div>

          {/* Forecast */}
          {weather.forecast && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🌤️ Weather Forecast</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{weather.forecast}</p>
            </div>
          )}

          {/* Typhoon / Tropical Cyclone */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🌀 Tropical Cyclone Bulletin</h3>
            {weather.typhoon ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{weather.typhoon}</p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No active tropical cyclone within the Philippine Area of Responsibility.</p>
            )}
          </div>

          {/* Signal Guide */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">⛈️ Tropical Cyclone Signal Guide</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 py-2">
                <span className="text-2xl">🟢</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Signal No. 1</p>
                  <p className="text-gray-600 dark:text-gray-400">Winds of 30-60 km/h expected in 36 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <span className="text-2xl">🟡</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Signal No. 2</p>
                  <p className="text-gray-600 dark:text-gray-400">Winds of 61-120 km/h expected in 24 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <span className="text-2xl">🟠</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Signal No. 3</p>
                  <p className="text-gray-600 dark:text-gray-400">Winds of 121-170 km/h expected in 18 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <span className="text-2xl">🔴</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Signal No. 4</p>
                  <p className="text-gray-600 dark:text-gray-400">Winds of 171-220 km/h expected in 12 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <span className="text-2xl">🟣</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Signal No. 5</p>
                  <p className="text-gray-600 dark:text-gray-400">Winds exceeding 220 km/h expected in 12 hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a href="https://www.pagasa.dost.gov.ph/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
              Visit PAGASA for latest updates →
            </a>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
