export interface WeatherCodeInfo {
  description: string;
  icon: string;
  nightIcon?: string;
  gradient: string;
}

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', icon: 'sun', nightIcon: 'moon', gradient: 'clear-day' },
  1: { description: 'Mainly clear', icon: 'sun-cloud', nightIcon: 'moon-cloud', gradient: 'clear-day' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun', nightIcon: 'cloud-moon', gradient: 'cloudy' },
  3: { description: 'Overcast', icon: 'clouds', gradient: 'cloudy' },
  45: { description: 'Foggy', icon: 'fog', gradient: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'fog', gradient: 'fog' },
  51: { description: 'Light drizzle', icon: 'drizzle', gradient: 'rain' },
  53: { description: 'Moderate drizzle', icon: 'drizzle', gradient: 'rain' },
  55: { description: 'Dense drizzle', icon: 'drizzle', gradient: 'rain' },
  56: { description: 'Light freezing drizzle', icon: 'sleet', gradient: 'rain' },
  57: { description: 'Dense freezing drizzle', icon: 'sleet', gradient: 'rain' },
  61: { description: 'Slight rain', icon: 'rain-light', gradient: 'rain' },
  63: { description: 'Moderate rain', icon: 'rain', gradient: 'rain' },
  65: { description: 'Heavy rain', icon: 'rain-heavy', gradient: 'rain' },
  66: { description: 'Light freezing rain', icon: 'sleet', gradient: 'rain' },
  67: { description: 'Heavy freezing rain', icon: 'sleet', gradient: 'rain' },
  71: { description: 'Slight snowfall', icon: 'snow-light', gradient: 'snow' },
  73: { description: 'Moderate snowfall', icon: 'snow', gradient: 'snow' },
  75: { description: 'Heavy snowfall', icon: 'snow-heavy', gradient: 'snow' },
  77: { description: 'Snow grains', icon: 'snow-light', gradient: 'snow' },
  80: { description: 'Slight rain showers', icon: 'rain-light', gradient: 'rain' },
  81: { description: 'Moderate rain showers', icon: 'rain', gradient: 'rain' },
  82: { description: 'Violent rain showers', icon: 'rain-heavy', gradient: 'storm' },
  85: { description: 'Slight snow showers', icon: 'snow-light', gradient: 'snow' },
  86: { description: 'Heavy snow showers', icon: 'snow-heavy', gradient: 'snow' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm', gradient: 'storm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm', gradient: 'storm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm', gradient: 'storm' },
};

export function getWeatherInfo(code: number, isDay = true): WeatherCodeInfo {
  const info = WEATHER_CODES[code] ?? { description: 'Unknown', icon: 'cloud', gradient: 'cloudy' };
  if (!isDay && info.nightIcon) {
    return { ...info, icon: info.nightIcon };
  }
  return info;
}

export function getWeatherGradientVar(code: number, isDay = true): string {
  const info = WEATHER_CODES[code];
  if (!info) return 'var(--gradient-cloudy)';
  const gradient = info.gradient;
  if (gradient === 'clear-day' && !isDay) return 'var(--gradient-clear-night)';
  return 'var(--gradient-' + gradient + ')';
}
