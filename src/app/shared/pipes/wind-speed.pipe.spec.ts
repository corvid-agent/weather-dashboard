import { describe, test, expect } from 'bun:test';
import { WindSpeedPipe } from './wind-speed.pipe';

describe('WindSpeedPipe', () => {
  const pipe = new WindSpeedPipe();

  test('km/h stays as km/h', () => {
    expect(pipe.transform(100, 'km/h')).toBe('100 km/h');
  });

  test('converts km/h to mph', () => {
    const result = pipe.transform(100, 'mph');
    expect(result).toBe('62 mph');
  });

  test('converts km/h to m/s', () => {
    const result = pipe.transform(36, 'm/s');
    expect(result).toBe('10 m/s');
  });

  test('converts km/h to knots', () => {
    const result = pipe.transform(100, 'kn');
    expect(result).toBe('54 kn');
  });

  test('null returns --', () => {
    expect(pipe.transform(null)).toBe('--');
  });

  test('undefined returns --', () => {
    expect(pipe.transform(undefined)).toBe('--');
  });

  test('zero km/h', () => {
    expect(pipe.transform(0, 'km/h')).toBe('0 km/h');
  });

  test('defaults to km/h', () => {
    expect(pipe.transform(50)).toBe('50 km/h');
  });
});
