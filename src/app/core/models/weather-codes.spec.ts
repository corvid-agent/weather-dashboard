import { describe, test, expect } from 'bun:test';
import { getWeatherInfo, getWeatherGradientVar, WEATHER_CODES } from './weather-codes';

describe('getWeatherInfo', () => {
  test('code 0 daytime returns sun icon', () => {
    const info = getWeatherInfo(0, true);
    expect(info.description).toBe('Clear sky');
    expect(info.icon).toBe('sun');
  });

  test('code 0 nighttime returns moon icon', () => {
    const info = getWeatherInfo(0, false);
    expect(info.description).toBe('Clear sky');
    expect(info.icon).toBe('moon');
  });

  test('code 3 (overcast) has no night variant', () => {
    const day = getWeatherInfo(3, true);
    const night = getWeatherInfo(3, false);
    expect(day.icon).toBe('clouds');
    expect(night.icon).toBe('clouds');
  });

  test('code 95 returns thunderstorm', () => {
    const info = getWeatherInfo(95);
    expect(info.description).toBe('Thunderstorm');
    expect(info.icon).toBe('thunderstorm');
  });

  test('unknown code returns fallback', () => {
    const info = getWeatherInfo(999);
    expect(info.description).toBe('Unknown');
    expect(info.icon).toBe('cloud');
  });

  test('all defined codes have description and icon', () => {
    for (const code of Object.keys(WEATHER_CODES)) {
      const info = getWeatherInfo(Number(code));
      expect(info.description.length).toBeGreaterThan(0);
      expect(info.icon.length).toBeGreaterThan(0);
    }
  });
});

describe('getWeatherGradientVar', () => {
  test('clear sky day returns clear-day', () => {
    expect(getWeatherGradientVar(0, true)).toBe('var(--gradient-clear-day)');
  });

  test('clear sky night returns clear-night', () => {
    expect(getWeatherGradientVar(0, false)).toBe('var(--gradient-clear-night)');
  });

  test('rain code returns rain gradient', () => {
    expect(getWeatherGradientVar(61)).toBe('var(--gradient-rain)');
  });

  test('storm code returns storm gradient', () => {
    expect(getWeatherGradientVar(95)).toBe('var(--gradient-storm)');
  });

  test('snow code returns snow gradient', () => {
    expect(getWeatherGradientVar(73)).toBe('var(--gradient-snow)');
  });

  test('fog code returns fog gradient', () => {
    expect(getWeatherGradientVar(45)).toBe('var(--gradient-fog)');
  });

  test('unknown code returns cloudy fallback', () => {
    expect(getWeatherGradientVar(999)).toBe('var(--gradient-cloudy)');
  });
});
