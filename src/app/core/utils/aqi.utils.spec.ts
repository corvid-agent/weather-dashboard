import { describe, test, expect } from 'bun:test';
import { getAqiCategory, getAqiPercent } from './aqi.utils';

describe('getAqiCategory', () => {
  test('AQI 25 is Good', () => {
    expect(getAqiCategory(25).level).toBe('Good');
  });

  test('AQI 50 is Good (boundary)', () => {
    expect(getAqiCategory(50).level).toBe('Good');
  });

  test('AQI 51 is Moderate', () => {
    expect(getAqiCategory(51).level).toBe('Moderate');
  });

  test('AQI 100 is Moderate (boundary)', () => {
    expect(getAqiCategory(100).level).toBe('Moderate');
  });

  test('AQI 125 is Unhealthy for Sensitive Groups', () => {
    expect(getAqiCategory(125).level).toBe('Unhealthy for Sensitive Groups');
  });

  test('AQI 175 is Unhealthy', () => {
    expect(getAqiCategory(175).level).toBe('Unhealthy');
  });

  test('AQI 250 is Very Unhealthy', () => {
    expect(getAqiCategory(250).level).toBe('Very Unhealthy');
  });

  test('AQI 400 is Hazardous', () => {
    expect(getAqiCategory(400).level).toBe('Hazardous');
  });

  test('each category has recommendation and color', () => {
    for (const aqi of [10, 75, 120, 180, 250, 400]) {
      const cat = getAqiCategory(aqi);
      expect(cat.recommendation.length).toBeGreaterThan(0);
      expect(cat.color.length).toBeGreaterThan(0);
    }
  });
});

describe('getAqiPercent', () => {
  test('AQI 0 is 0%', () => {
    expect(getAqiPercent(0)).toBe(0);
  });

  test('AQI 250 is 50%', () => {
    expect(getAqiPercent(250)).toBe(50);
  });

  test('AQI 500 is 100%', () => {
    expect(getAqiPercent(500)).toBe(100);
  });

  test('AQI 600 caps at 100%', () => {
    expect(getAqiPercent(600)).toBe(100);
  });
});
