import { describe, test, expect } from 'bun:test';
import { TemperaturePipe } from './temperature.pipe';

describe('TemperaturePipe', () => {
  const pipe = new TemperaturePipe();

  test('converts Celsius to Celsius with symbol', () => {
    expect(pipe.transform(20, '°C')).toBe('20°C');
  });

  test('converts Celsius to Fahrenheit', () => {
    expect(pipe.transform(0, '°F')).toBe('32°F');
  });

  test('converts 100C to 212F', () => {
    expect(pipe.transform(100, '°F')).toBe('212°F');
  });

  test('rounds to nearest integer', () => {
    expect(pipe.transform(20.6, '°C')).toBe('21°C');
    expect(pipe.transform(20.4, '°C')).toBe('20°C');
  });

  test('negative Celsius values', () => {
    expect(pipe.transform(-10, '°C')).toBe('-10°C');
  });

  test('negative Celsius to Fahrenheit', () => {
    // -40C = -40F
    expect(pipe.transform(-40, '°F')).toBe('-40°F');
  });

  test('null value returns --', () => {
    expect(pipe.transform(null)).toBe('--');
  });

  test('undefined value returns --', () => {
    expect(pipe.transform(undefined)).toBe('--');
  });

  test('defaults to Celsius when no symbol', () => {
    expect(pipe.transform(25)).toBe('25°C');
  });
});
