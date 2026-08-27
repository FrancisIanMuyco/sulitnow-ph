import { useState, useEffect, useCallback, useRef } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';
import { RefreshCw, MapPin, Wind, Droplets, Umbrella } from 'lucide-react';

// WMO Weather Code descriptions
const WMO_CODES: Record<number, { desc: string; icon: string; color: string }> = {
  0: { desc: 'Clear sky', icon: '☀️', color: 'text-yellow-500' },
  1: { desc: 'Mainly clear', icon: '🌤️', color: 'text-yellow-400' },
  2: { desc: 'Partly cloudy', icon: '⛅', color: 'text-blue-400' },
  3: { desc: 'Overcast', icon: '☁️', color: 'text-gray-400' },
  45: { desc: 'Foggy', icon: '🌫️', color: 'text-gray-500' },
  48: { desc: 'Rime fog', icon: '🌫️', color: 'text-gray-500' },
  51: { desc: 'Light drizzle', icon: '🌦️', color: 'text-blue-400' },
  53: { desc: 'Moderate drizzle', icon: '🌦️', color: 'text-blue-500' },
  55: { desc: 'Dense drizzle', icon: '🌧️', color: 'text-blue-600' },
  61: { desc: 'Slight rain', icon: '🌧️', color: 'text-blue-500' },
  63: { desc: 'Moderate rain', icon: '🌧️', color: 'text-blue-600' },
  65: { desc: 'Heavy rain', icon: '⛈️', color: 'text-blue-700' },
  71: { desc: 'Slight snow', icon: '❄️', color: 'text-blue-300' },
  73: { desc: 'Moderate snow', icon: '❄️', color: 'text-blue-400' },
  75: { desc: 'Heavy snow', icon: '❄️', color: 'text-blue-500' },
  80: { desc: 'Slight rain showers', icon: '🌦️', color: 'text-blue-400' },
  81: { desc: 'Moderate rain showers', icon: '🌧️', color: 'text-blue-500' },
  82: { desc: 'Violent rain showers', icon: '⛈️', color: 'text-blue-700' },
  95: { desc: 'Thunderstorm', icon: '⛈️', color: 'text-purple-600' },
  96: { desc: 'Thunderstorm w/ hail', icon: '⛈️', color: 'text-purple-700' },
  99: { desc: 'Severe thunderstorm', icon: '🌩️', color: 'text-red-600' },
};

// Philippine cities with coordinates
const PH_CITIES = [
  { name: 'Metro Manila', lat: 14.5995, lon: 120.9842 },
  { name: 'Quezon City', lat: 14.6760, lon: 121.0437 },
  { name: 'Davao City', lat: 7.1907, lon: 125.4553 },
  { name: 'Cebu City', lat: 10.3157, lon: 123.8854 },
  { name: 'Zamboanga City', lat: 6.9214, lon: 122.0790 },
  { name: 'Taguig City', lat: 14.5176, lon: 121.0531 },
  { name: 'Cagayan de Oro', lat: 8.4542, lon: 124.6310 },
  { name: 'General Santos', lat: 6.1164, lon: 125.1716 },
  { name: 'Iloilo City', lat: 10.7202, lon: 122.5621 },
  { name: 'Bacolod City', lat: 10.6761, lon: 122.9530 },
  { name: 'Tacloban City', lat: 11.2499, lon: 125.0004 },
  { name: 'Baguio City', lat: 16.4023, lon: 120.5960 },
  { name: 'Puerto Princesa', lat: 9.8340, lon: 118.7384 },
  { name: 'Olongapo City', lat: 14.8385, lon: 120.2839 },
  { name: 'Legazpi City', lat: 13.1371, lon: 123.7535 },
  { name: 'Naga City', lat: 13.6218, lon: 123.1947 },
  { name: 'Butuan City', lat: 8.9493, lon: 125.5436 },
  { name: 'Cotabato City', lat: 7.2229, lon: 124.2460 },
  { name: 'Dumaguete City', lat: 9.3068, lon: 123.3054 },
  { name: 'Vigan City', lat: 17.5747, lon: 120.3870 },
];

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function WeatherChecker() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [nextRefresh, setNextRefresh] = useState<number>(REFRESH_INTERVAL / 1000);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedCity, setSelectedCity] = useState(PH_CITIES[0]);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [liveStatus, setLiveStatus] = useState<'connecting' | 'live' | 'error'>('connecting');
  const [pulsa, setPulsa] = useState<{ signal?: string; bulletin?: string }>({});
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLiveStatus('connecting');
    try {
      // Fetch from Open-Meteo (free, CORS-friendly, no key needed)
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,visibility` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset` +
        `&hourly=temperature_2m,precipitation_probability,weather_code` +
        `&timezone=Asia/Manila&forecast_days=7`
      );
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();

      const current = data.current;
      const wmo = WMO_CODES[current.weather_code] || { desc: 'Unknown', icon: '🌡️', color: 'text-gray-400' };

      setWeather({
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        windGusts: current.wind_gusts_10m,
        precipitation: current.precipitation,
        uvIndex: current.uv_index,
        visibility: current.visibility,
        weatherCode: current.weather_code,
        description: wmo.desc,
        icon: wmo.icon,
        color: wmo.color,
        city: PH_CITIES.find(c => c.lat === lat && c.lon === lon)?.name || 'Philippines',
      });

      // Build 7-day forecast
      const days = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 0; i < 7; i++) {
        const d = new Date(data.daily.time[i] + 'T12:00:00');
        const dayWmo = WMO_CODES[data.daily.weather_code[i]] || { desc: 'Unknown', icon: '🌡️' };
        days.push({
          date: data.daily.time[i],
          dayName: i === 0 ? 'Today' : dayNames[d.getDay()],
          max: data.daily.temperature_2m_max[i],
          min: data.daily.temperature_2m_min[i],
          precipitation: data.daily.precipitation_sum[i],
          precipProb: data.daily.precipitation_probability_max[i],
          windMax: data.daily.wind_speed_10m_max[i],
          weatherCode: data.daily.weather_code[i],
          description: dayWmo.desc,
          icon: dayWmo.icon,
          sunrise: data.daily.sunrise[i],
          sunset: data.daily.sunset[i],
        });
      }
      setForecast(days);

      // Hourly for next 24h
      const hourlySlice = data.hourly?.time?.slice(0, 24) || [];
      const hourlyTemps = data.hourly?.temperature_2m?.slice(0, 24) || [];
      const hourlyPrecip = data.hourly?.precipitation_probability?.slice(0, 24) || [];
      const hourlyCodes = data.hourly?.weather_code?.slice(0, 24) || [];
      
      if (weather) {
        setWeather((prev: any) => ({
          ...prev,
          hourly: hourlySlice.map((time: string, idx: number) => ({
            time: time,
            hour: new Date(time).getHours(),
            temp: hourlyTemps[idx],
            precipProb: hourlyPrecip[idx],
            weatherCode: hourlyCodes[idx],
            icon: (WMO_CODES[hourlyCodes[idx]] || { icon: '🌡️' }).icon,
          })),
        }));
      }

      setLastUpdated(new Date());
      setLiveStatus('live');
      setNextRefresh(REFRESH_INTERVAL / 1000);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setLiveStatus('error');
      setError('Unable to fetch live weather. Check your connection.');
      
      // Try fallback to local data
      try {
        const fallback = await fetch('/data/weather.json');
        if (fallback.ok) {
          const fbData = await fallback.json();
          const cityData = fbData.cities?.[0];
          if (cityData) {
            const wmo = WMO_CODES[cityData.weatherCode] || { desc: 'Unknown', icon: '🌡️', color: 'text-gray-400' };
            setWeather({
              temperature: cityData.temperature,
              feelsLike: cityData.feelsLike,
              humidity: cityData.humidity,
              windSpeed: cityData.windSpeed,
              windDirection: cityData.windDirection,
              precipitation: cityData.precipitation,
              weatherCode: cityData.weatherCode,
              description: wmo.desc,
              icon: wmo.icon,
              color: wmo.color,
              city: cityData.city || 'Philippines',
              source: 'Open-Meteo (cached)',
            });
            setForecast((cityData.forecast || []).map((d: any, i: number) => {
              const dayWmo = WMO_CODES[d.weatherCode] || { desc: 'Unknown', icon: '🌡️' };
              return {
                ...d,
                dayName: i === 0 ? 'Today' : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d.date + 'T12:00:00').getDay()],
                description: dayWmo.desc,
                icon: dayWmo.icon,
              };
            }));
            setLastUpdated(new Date(fbData.lastUpdated));
            setLiveStatus('live');
            setError('');
          }
        }
      } catch {}
    }
  }, []);

  // Fetch PAGASA typhoon bulletin (from weather.json if available)
  const fetchPAGASA = useCallback(async () => {
    try {
      const res = await fetch('/data/weather.json');
      if (res.ok) {
        const data = await res.json();
        // Only show if actual typhoon data exists (not error messages)
        const forecast = data.cities?.[0]?.forecast;
        setPulsa({
          signal: data.typhoon && !data.typhoon.startsWith('Unable') ? data.typhoon : null,
          bulletin: forecast?.[0]?.description || null,
        });
      }
    } catch {}
  }, []);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchWeather(selectedCity.lat, selectedCity.lon),
      fetchPAGASA(),
    ]).finally(() => setLoading(false));
  }, [selectedCity, fetchWeather, fetchPAGASA]);

  // Auto-refresh timer
  useEffect(() => {
    if (autoRefresh) {
      refreshTimerRef.current = setInterval(() => {
        setNextRefresh(prev => {
          if (prev <= 1) {
            fetchWeather(selectedCity.lat, selectedCity.lon);
            return REFRESH_INTERVAL / 1000;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [autoRefresh, selectedCity, fetchWeather]);

  // City filter
  const filteredCities = PH_CITIES.filter(c =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const getWindDirection = (deg: number) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' };
    if (uv <= 10) return { label: 'Very High', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' };
    return { label: 'Extreme', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' };
  };

  return (
    <ToolLayout
      tool={{ id: 'weather-checker', name: 'Live Weather Checker', slug: 'weather-checker', description: 'Real-time Philippine weather with 7-day forecast, hourly updates, and typhoon alerts from PAGASA.', category: 'daily', keywords: ['weather', 'pagasa', 'typhoon', 'forecast', 'ulan', 'init'], icon: 'CloudRain', status: 'active', path: '/tools/weather-checker', requiresApi: false }}
    >
      {loading ? (
        <div className="space-y-4">
          <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}
          </div>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
      ) : error && !weather ? (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 text-center border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button onClick={() => fetchWeather(selectedCity.lat, selectedCity.lon)}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium">
            Retry
          </button>
          <a href="https://www.pagasa.dost.gov.ph/" target="_blank" rel="noopener noreferrer"
            className="mt-3 block text-sm text-emerald-600 dark:text-emerald-400 underline">
            Visit PAGASA directly →
          </a>
        </div>
      ) : weather && (
        <div className="space-y-4">
          {/* Live Status Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${liveStatus === 'live' ? 'bg-green-500 animate-pulse' : liveStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {liveStatus === 'live' ? 'LIVE' : liveStatus === 'connecting' ? 'Connecting...' : 'Offline'}
              </span>
              {lastUpdated && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  · Updated {lastUpdated.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {autoRefresh && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Next: {Math.floor(nextRefresh / 60)}:{(nextRefresh % 60).toString().padStart(2, '0')}
                </span>
              )}
              <button onClick={() => fetchWeather(selectedCity.lat, selectedCity.lon)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Refresh now">
                <RefreshCw size={14} className={`text-gray-500 ${liveStatus === 'connecting' ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${autoRefresh ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                {autoRefresh ? 'Auto' : 'Manual'}
              </button>
            </div>
          </div>

          {/* City Picker */}
          <button onClick={() => setShowCityPicker(!showCityPicker)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin size={14} className="text-blue-500" />
            {weather.city || selectedCity.name}
            <span className="text-xs text-gray-400">▾</span>
          </button>

          {showCityPicker && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 max-h-64 overflow-y-auto">
              <input type="text" placeholder="Search city..." value={citySearch} onChange={e => setCitySearch(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
              {filteredCities.map(city => (
                <button key={city.name} onClick={() => { setSelectedCity(city); setShowCityPicker(false); setCitySearch(''); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCity.name === city.name ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  <MapPin size={12} className="inline mr-2 opacity-50" />
                  {city.name}
                </button>
              ))}
            </div>
          )}

          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={12} className="opacity-70" />
                <p className="text-sm opacity-80">{weather.city || 'Philippines'}</p>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-bold tracking-tight">{Math.round(weather.temperature)}</span>
                    <span className="text-2xl opacity-70">°C</span>
                  </div>
                  <p className="text-lg mt-1 opacity-90">{weather.icon} {weather.description}</p>
                  {weather.feelsLike != null && (
                    <p className="text-sm opacity-60 mt-1">Feels like {Math.round(weather.feelsLike)}°C</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                    <Droplets size={12} /> Humidity
                  </div>
                  <p className="text-lg font-semibold">{weather.humidity}%</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                    <Wind size={12} /> Wind
                  </div>
                  <p className="text-lg font-semibold">{Math.round(weather.windSpeed)} km/h</p>
                  <p className="text-xs opacity-50">{getWindDirection(weather.windDirection || 0)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                    <Umbrella size={12} /> Rain
                  </div>
                  <p className="text-lg font-semibold">{weather.precipitation || 0} mm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            {weather.uvIndex != null && (
              <div className={`rounded-xl p-3 border ${getUVLevel(weather.uvIndex).bg} border-gray-200 dark:border-gray-700`}>
                <p className="text-xs text-gray-500 dark:text-gray-400">UV Index</p>
                <p className={`text-xl font-bold ${getUVLevel(weather.uvIndex).color}`}>{weather.uvIndex}</p>
                <p className={`text-xs font-medium ${getUVLevel(weather.uvIndex).color}`}>{getUVLevel(weather.uvIndex).label}</p>
              </div>
            )}
            {weather.windGusts != null && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Wind Gusts</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{Math.round(weather.windGusts)} km/h</p>
              </div>
            )}
            {forecast.length > 0 && forecast[0].sunrise && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">🌅 Sunrise / 🌇 Sunset</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(forecast[0].sunrise).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })} / {new Date(forecast[0].sunset).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
            {weather.visibility != null && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">👁️ Visibility</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{(weather.visibility / 1000).toFixed(1)} km</p>
              </div>
            )}
          </div>

          {/* Hourly Forecast */}
          {weather.hourly && weather.hourly.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">⏰ Next 24 Hours</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {weather.hourly.map((h: any, i: number) => {
                  const hWmo = WMO_CODES[h.weatherCode] || { icon: '🌡️' };
                  const now = new Date().getHours();
                  return (
                    <div key={i} className={`flex-shrink-0 text-center px-3 py-2 rounded-xl transition-colors ${h.hour === now ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{h.hour === now ? 'Now' : `${h.hour}:00`}</p>
                      <p className="text-lg my-0.5">{hWmo.icon}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{Math.round(h.temp)}°</p>
                      {h.precipProb > 0 && (
                        <p className="text-xs text-blue-500 font-medium">{h.precipProb}%</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7-Day Forecast */}
          {forecast.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">📅 7-Day Forecast</h3>
              <div className="space-y-1">
                {forecast.map((day, i) => (
                  <div key={i} className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${i === 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                    <span className={`text-sm font-medium w-12 ${i === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{day.dayName}</span>
                    <span className="text-lg">{day.icon}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-1 truncate">{day.description}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(day.max)}°</span>
                    <span className="text-sm text-gray-400 dark:text-gray-500">{Math.round(day.min)}°</span>
                    {day.precipProb > 0 && (
                      <span className="text-xs text-blue-500 font-medium w-8 text-right">{day.precipProb}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGASA Typhoon Bulletin */}
          {(pulsa.signal || pulsa.bulletin) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">🌀 PAGASA Advisory</h3>
              {pulsa.signal && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 mb-2">
                  <p className="text-sm text-red-700 dark:text-red-400 whitespace-pre-line">{pulsa.signal}</p>
                </div>
              )}
              {pulsa.bulletin && !pulsa.signal && (
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line line-clamp-4">{pulsa.bulletin}</p>
              )}
              <a href="https://www.pagasa.dost.gov.ph/" target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline mt-2 inline-block">
                View full PAGASA bulletin →
              </a>
            </div>
          )}

          {/* Data Source */}
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>📡 Source: Open-Meteo API + PAGASA · Auto-refreshes every 5 minutes</p>
            <p>Data: Open-Meteo (CC BY 4.0) · PAGASA (Philippine government)</p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
