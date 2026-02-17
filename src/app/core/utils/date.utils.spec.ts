import { describe, test, expect } from 'bun:test';
import { isSameDay, formatDuration } from './date.utils';

describe('isSameDay', () => {
  test('same date returns true', () => {
    const a = new Date(2024, 5, 15, 10, 30);
    const b = new Date(2024, 5, 15, 22, 45);
    expect(isSameDay(a, b)).toBe(true);
  });

  test('different days return false', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2024, 5, 16);
    expect(isSameDay(a, b)).toBe(false);
  });

  test('different months return false', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2024, 6, 15);
    expect(isSameDay(a, b)).toBe(false);
  });

  test('different years return false', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2025, 5, 15);
    expect(isSameDay(a, b)).toBe(false);
  });
});

describe('formatDuration', () => {
  test('0 seconds is 0h 0m', () => {
    expect(formatDuration(0)).toBe('0h 0m');
  });

  test('3600 seconds is 1h 0m', () => {
    expect(formatDuration(3600)).toBe('1h 0m');
  });

  test('3661 seconds is 1h 1m', () => {
    expect(formatDuration(3661)).toBe('1h 1m');
  });

  test('7200 seconds is 2h 0m', () => {
    expect(formatDuration(7200)).toBe('2h 0m');
  });

  test('5400 seconds is 1h 30m', () => {
    expect(formatDuration(5400)).toBe('1h 30m');
  });

  test('43200 seconds (12h) is 12h 0m', () => {
    expect(formatDuration(43200)).toBe('12h 0m');
  });
});
