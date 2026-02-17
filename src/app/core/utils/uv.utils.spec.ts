import { describe, test, expect } from 'bun:test';
import { getUvCategory, getUvPercent } from './uv.utils';

describe('getUvCategory', () => {
  test('UV 0 is Low', () => {
    expect(getUvCategory(0).level).toBe('Low');
  });

  test('UV 2 is Low', () => {
    expect(getUvCategory(2).level).toBe('Low');
  });

  test('UV 3 is Moderate', () => {
    expect(getUvCategory(3).level).toBe('Moderate');
  });

  test('UV 5 is Moderate', () => {
    expect(getUvCategory(5).level).toBe('Moderate');
  });

  test('UV 6 is High', () => {
    expect(getUvCategory(6).level).toBe('High');
  });

  test('UV 8 is Very High', () => {
    expect(getUvCategory(8).level).toBe('Very High');
  });

  test('UV 11 is Extreme', () => {
    expect(getUvCategory(11).level).toBe('Extreme');
  });

  test('each category has a recommendation', () => {
    for (const index of [0, 4, 7, 9, 12]) {
      const cat = getUvCategory(index);
      expect(cat.recommendation.length).toBeGreaterThan(0);
      expect(cat.color.length).toBeGreaterThan(0);
    }
  });
});

describe('getUvPercent', () => {
  test('UV 0 is 0%', () => {
    expect(getUvPercent(0)).toBe(0);
  });

  test('UV 7 is 50%', () => {
    expect(getUvPercent(7)).toBe(50);
  });

  test('UV 14 is 100%', () => {
    expect(getUvPercent(14)).toBe(100);
  });

  test('UV 20 caps at 100%', () => {
    expect(getUvPercent(20)).toBe(100);
  });
});
