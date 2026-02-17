import { describe, test, expect } from 'bun:test';
import { degreesToCompass, getBeaufortScale } from './wind.utils';

describe('degreesToCompass', () => {
  test('0 degrees is N', () => {
    expect(degreesToCompass(0)).toBe('N');
  });

  test('90 degrees is E', () => {
    expect(degreesToCompass(90)).toBe('E');
  });

  test('180 degrees is S', () => {
    expect(degreesToCompass(180)).toBe('S');
  });

  test('270 degrees is W', () => {
    expect(degreesToCompass(270)).toBe('W');
  });

  test('45 degrees is NE', () => {
    expect(degreesToCompass(45)).toBe('NE');
  });

  test('135 degrees is SE', () => {
    expect(degreesToCompass(135)).toBe('SE');
  });

  test('225 degrees is SW', () => {
    expect(degreesToCompass(225)).toBe('SW');
  });

  test('315 degrees is NW', () => {
    expect(degreesToCompass(315)).toBe('NW');
  });

  test('360 degrees wraps to N', () => {
    expect(degreesToCompass(360)).toBe('N');
  });

  test('negative degrees are handled', () => {
    expect(degreesToCompass(-90)).toBe('W');
  });

  test('720 degrees wraps correctly', () => {
    expect(degreesToCompass(720)).toBe('N');
  });
});

describe('getBeaufortScale', () => {
  test('0 km/h is calm (force 0)', () => {
    const result = getBeaufortScale(0);
    expect(result.force).toBe(0);
    expect(result.description).toBe('Calm');
  });

  test('3 km/h is light air (force 1)', () => {
    const result = getBeaufortScale(3);
    expect(result.force).toBe(1);
    expect(result.description).toBe('Light air');
  });

  test('10 km/h is light breeze (force 2)', () => {
    const result = getBeaufortScale(10);
    expect(result.force).toBe(2);
  });

  test('25 km/h is moderate breeze (force 4)', () => {
    const result = getBeaufortScale(25);
    expect(result.force).toBe(4);
  });

  test('49 km/h is strong breeze (force 6)', () => {
    const result = getBeaufortScale(49);
    expect(result.force).toBe(6);
  });

  test('88 km/h is strong gale (force 9)', () => {
    const result = getBeaufortScale(88);
    expect(result.force).toBe(9);
  });

  test('120 km/h is hurricane force (force 12)', () => {
    const result = getBeaufortScale(120);
    expect(result.force).toBe(12);
    expect(result.description).toBe('Hurricane force');
  });
});
