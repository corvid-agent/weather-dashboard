import { describe, test, expect } from 'bun:test';
import { getComfortAdvice } from './comfort.utils';

describe('getComfortAdvice', () => {
  test('extreme cold returns freezing level', () => {
    const advice = getComfortAdvice(-20, 50, 10, 0);
    expect(advice.level).toBe('freezing');
    expect(advice.summary).toBe('Dangerously cold');
  });

  test('very cold returns freezing level', () => {
    const advice = getComfortAdvice(-10, 50, 10, 0);
    expect(advice.level).toBe('freezing');
    expect(advice.summary).toBe('Very cold');
  });

  test('cold returns cold level', () => {
    const advice = getComfortAdvice(0, 50, 10, 0);
    expect(advice.level).toBe('cold');
    expect(advice.summary).toBe('Cold');
  });

  test('chilly returns cool level', () => {
    const advice = getComfortAdvice(8, 50, 10, 0);
    expect(advice.level).toBe('cool');
    expect(advice.summary).toBe('Chilly');
  });

  test('cool returns cool level', () => {
    const advice = getComfortAdvice(14, 50, 10, 0);
    expect(advice.level).toBe('cool');
    expect(advice.summary).toBe('Cool');
  });

  test('comfortable returns mild level', () => {
    const advice = getComfortAdvice(20, 50, 10, 0);
    expect(advice.level).toBe('mild');
    expect(advice.summary).toBe('Comfortable');
  });

  test('warm returns warm level', () => {
    const advice = getComfortAdvice(26, 50, 10, 0);
    expect(advice.level).toBe('warm');
    expect(advice.summary).toBe('Warm');
  });

  test('hot returns hot level', () => {
    const advice = getComfortAdvice(32, 50, 10, 0);
    expect(advice.level).toBe('hot');
    expect(advice.summary).toBe('Hot');
  });

  test('extreme heat returns extreme level', () => {
    const advice = getComfortAdvice(40, 50, 10, 0);
    expect(advice.level).toBe('extreme');
    expect(advice.summary).toBe('Extreme heat');
  });

  test('high rain probability adds umbrella note', () => {
    const advice = getComfortAdvice(20, 50, 10, 60);
    expect(advice.clothing).toContain('umbrella');
  });

  test('low rain probability does not add umbrella note', () => {
    const advice = getComfortAdvice(20, 50, 10, 20);
    expect(advice.clothing).not.toContain('umbrella');
  });

  test('windy conditions with cool temps add windbreaker note', () => {
    const advice = getComfortAdvice(8, 50, 40, 0);
    expect(advice.clothing).toContain('indbreaker');
  });

  test('high humidity with warm temps adds breathable note', () => {
    const advice = getComfortAdvice(26, 70, 10, 0);
    expect(advice.clothing).toContain('breathable');
  });
});
