#!/usr/bin/env python3
"""Scrape weather data using Open-Meteo API (free, no key needed)."""
import json, os, urllib.request
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')

WMO_CODES = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
    55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Severe thunderstorm',
}

PH_CITIES = [
    {'name': 'Metro Manila', 'lat': 14.5995, 'lon': 120.9842},
    {'name': 'Cebu City', 'lat': 10.3157, 'lon': 123.8854},
    {'name': 'Davao City', 'lat': 7.1907, 'lon': 125.4553},
]

def fetch_json(url, timeout=15):
    req = urllib.request.Request(url, headers={'User-Agent': 'SulitNowPH/1.0'})
    return json.loads(urllib.request.urlopen(req, timeout=timeout).read())

def scrape_weather():
    print('🌤️ Scraping weather (Open-Meteo API)...')
    results = []

    for city in PH_CITIES:
        try:
            url = (
                f"https://api.open-meteo.com/v1/forecast?"
                f"latitude={city['lat']}&longitude={city['lon']}"
                f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,"
                f"precipitation,weather_code,wind_speed_10m,wind_direction_10m"
                f"&daily=weather_code,temperature_2m_max,temperature_2m_min,"
                f"precipitation_sum,precipitation_probability_max"
                f"&timezone=Asia/Manila&forecast_days=7"
            )
            data = fetch_json(url, timeout=10)
            current = data['current']

            forecast = []
            for i in range(7):
                wmo = data['daily']['weather_code'][i]
                forecast.append({
                    'date': data['daily']['time'][i],
                    'weatherCode': wmo,
                    'description': WMO_CODES.get(wmo, 'Unknown'),
                    'max': data['daily']['temperature_2m_max'][i],
                    'min': data['daily']['temperature_2m_min'][i],
                    'precipitation': data['daily']['precipitation_sum'][i],
                    'precipProb': data['daily']['precipitation_probability_max'][i],
                })

            results.append({
                'city': city['name'],
                'temperature': current['temperature_2m'],
                'feelsLike': current['apparent_temperature'],
                'humidity': current['relative_humidity_2m'],
                'windSpeed': current['wind_speed_10m'],
                'windDirection': current['wind_direction_10m'],
                'precipitation': current['precipitation'],
                'weatherCode': current['weather_code'],
                'description': WMO_CODES.get(current['weather_code'], 'Unknown'),
                'forecast': forecast,
            })
            print(f"  ✅ {city['name']}: {current['temperature_2m']}°C, {WMO_CODES.get(current['weather_code'], 'Unknown')}")
        except Exception as e:
            print(f"  ❌ {city['name']}: {e}")

    output = {
        'lastUpdated': datetime.now().isoformat(),
        'source': 'Open-Meteo API',
        'cities': results,
    }
    path = os.path.join(DATA_DIR, 'weather.json')
    with open(path, 'w') as f:
        json.dump(output, f, indent=2)
    print(f"  📁 Saved weather.json ({os.path.getsize(path):,} bytes)")

if __name__ == '__main__':
    scrape_weather()
