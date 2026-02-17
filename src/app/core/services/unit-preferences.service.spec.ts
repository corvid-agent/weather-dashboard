import { describe, test, expect } from 'bun:test';

/**
 * Test unit preference logic — symbol mapping and merge patterns.
 */

type TemperatureUnit = 'celsius' | 'fahrenheit';
type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'kn';
type PrecipitationUnit = 'mm' | 'inch';

interface UnitPreferences {
  temperature: TemperatureUnit;
  windSpeed: WindSpeedUnit;
  precipitation: PrecipitationUnit;
}

function getTemperatureSymbol(unit: TemperatureUnit): string {
  return unit === 'celsius' ? '°C' : '°F';
}

function getWindSpeedSymbol(unit: WindSpeedUnit): string {
  const map: Record<WindSpeedUnit, string> = { kmh: 'km/h', mph: 'mph', ms: 'm/s', kn: 'kn' };
  return map[unit];
}

function getPrecipitationSymbol(unit: PrecipitationUnit): string {
  return unit === 'mm' ? 'mm' : 'in';
}

describe('UnitPreferences symbols', () => {
  test('temperature symbol for celsius', () => {
    expect(getTemperatureSymbol('celsius')).toBe('°C');
  });

  test('temperature symbol for fahrenheit', () => {
    expect(getTemperatureSymbol('fahrenheit')).toBe('°F');
  });

  test('wind speed symbol for all units', () => {
    expect(getWindSpeedSymbol('kmh')).toBe('km/h');
    expect(getWindSpeedSymbol('mph')).toBe('mph');
    expect(getWindSpeedSymbol('ms')).toBe('m/s');
    expect(getWindSpeedSymbol('kn')).toBe('kn');
  });

  test('precipitation symbol for mm', () => {
    expect(getPrecipitationSymbol('mm')).toBe('mm');
  });

  test('precipitation symbol for inch', () => {
    expect(getPrecipitationSymbol('inch')).toBe('in');
  });
});

describe('UnitPreferences merge', () => {
  test('partial update preserves unchanged fields', () => {
    const base: UnitPreferences = {
      temperature: 'celsius',
      windSpeed: 'kmh',
      precipitation: 'mm',
    };
    const updated = { ...base, temperature: 'fahrenheit' as TemperatureUnit };
    expect(updated.temperature).toBe('fahrenheit');
    expect(updated.windSpeed).toBe('kmh');
    expect(updated.precipitation).toBe('mm');
  });

  test('full imperial set', () => {
    const imperial: UnitPreferences = {
      temperature: 'fahrenheit',
      windSpeed: 'mph',
      precipitation: 'inch',
    };
    expect(getTemperatureSymbol(imperial.temperature)).toBe('°F');
    expect(getWindSpeedSymbol(imperial.windSpeed)).toBe('mph');
    expect(getPrecipitationSymbol(imperial.precipitation)).toBe('in');
  });

  test('full metric set', () => {
    const metric: UnitPreferences = {
      temperature: 'celsius',
      windSpeed: 'kmh',
      precipitation: 'mm',
    };
    expect(getTemperatureSymbol(metric.temperature)).toBe('°C');
    expect(getWindSpeedSymbol(metric.windSpeed)).toBe('km/h');
    expect(getPrecipitationSymbol(metric.precipitation)).toBe('mm');
  });
});
