import { getWeatherGradientVar } from '../models/weather-codes';

export function getBackgroundGradient(weatherCode: number | undefined, isDay: boolean): string {
  if (weatherCode === undefined) return 'var(--gradient-clear-day)';
  return getWeatherGradientVar(weatherCode, isDay);
}

/** Returns a CSS color variable based on Celsius temperature (data is always in Celsius) */
export function getTemperatureColor(celsius: number): string {
  if (celsius <= -10) return 'var(--temp-freezing)';
  if (celsius <= 0) return 'var(--temp-cold)';
  if (celsius <= 10) return 'var(--temp-cool)';
  if (celsius <= 20) return 'var(--temp-mild)';
  if (celsius <= 30) return 'var(--temp-warm)';
  if (celsius <= 38) return 'var(--temp-hot)';
  return 'var(--temp-extreme)';
}
