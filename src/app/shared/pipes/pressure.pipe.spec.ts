import { describe, test, expect } from 'bun:test';
import { PressurePipe } from './pressure.pipe';

describe('PressurePipe', () => {
  const pipe = new PressurePipe();

  test('formats pressure with hPa unit', () => {
    expect(pipe.transform(1013)).toBe('1013 hPa');
  });

  test('rounds to nearest integer', () => {
    expect(pipe.transform(1013.7)).toBe('1014 hPa');
    expect(pipe.transform(1013.2)).toBe('1013 hPa');
  });

  test('null returns --', () => {
    expect(pipe.transform(null)).toBe('--');
  });

  test('undefined returns --', () => {
    expect(pipe.transform(undefined)).toBe('--');
  });
});
