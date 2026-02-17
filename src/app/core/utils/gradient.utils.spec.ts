import { describe, test, expect } from 'bun:test';
import { getBackgroundGradient, getTemperatureColor } from './gradient.utils';

describe('getBackgroundGradient', () => {
  test('undefined code returns clear-day default', () => {
    expect(getBackgroundGradient(undefined, true)).toBe('var(--gradient-clear-day)');
  });

  test('clear sky daytime returns clear-day', () => {
    expect(getBackgroundGradient(0, true)).toBe('var(--gradient-clear-day)');
  });

  test('clear sky nighttime returns clear-night', () => {
    expect(getBackgroundGradient(0, false)).toBe('var(--gradient-clear-night)');
  });

  test('rain code returns rain gradient', () => {
    expect(getBackgroundGradient(63, true)).toBe('var(--gradient-rain)');
  });

  test('snow code returns snow gradient', () => {
    expect(getBackgroundGradient(73, true)).toBe('var(--gradient-snow)');
  });

  test('thunderstorm returns storm gradient', () => {
    expect(getBackgroundGradient(95, true)).toBe('var(--gradient-storm)');
  });

  test('fog returns fog gradient', () => {
    expect(getBackgroundGradient(45, true)).toBe('var(--gradient-fog)');
  });

  test('unknown code returns cloudy fallback', () => {
    expect(getBackgroundGradient(999, true)).toBe('var(--gradient-cloudy)');
  });
});

describe('getTemperatureColor', () => {
  test('very cold returns freezing', () => {
    expect(getTemperatureColor(-15)).toBe('var(--temp-freezing)');
  });

  test('cold returns cold', () => {
    expect(getTemperatureColor(-5)).toBe('var(--temp-cold)');
  });

  test('cool returns cool', () => {
    expect(getTemperatureColor(5)).toBe('var(--temp-cool)');
  });

  test('mild returns mild', () => {
    expect(getTemperatureColor(15)).toBe('var(--temp-mild)');
  });

  test('warm returns warm', () => {
    expect(getTemperatureColor(25)).toBe('var(--temp-warm)');
  });

  test('hot returns hot', () => {
    expect(getTemperatureColor(35)).toBe('var(--temp-hot)');
  });

  test('extreme returns extreme', () => {
    expect(getTemperatureColor(45)).toBe('var(--temp-extreme)');
  });
});
