import { describe, test, expect } from 'bun:test';
import { WindDirectionPipe } from './wind-direction.pipe';

describe('WindDirectionPipe', () => {
  const pipe = new WindDirectionPipe();

  test('0 degrees returns N', () => {
    expect(pipe.transform(0)).toBe('N');
  });

  test('90 degrees returns E', () => {
    expect(pipe.transform(90)).toBe('E');
  });

  test('180 degrees returns S', () => {
    expect(pipe.transform(180)).toBe('S');
  });

  test('270 degrees returns W', () => {
    expect(pipe.transform(270)).toBe('W');
  });

  test('null returns --', () => {
    expect(pipe.transform(null)).toBe('--');
  });

  test('undefined returns --', () => {
    expect(pipe.transform(undefined)).toBe('--');
  });
});
