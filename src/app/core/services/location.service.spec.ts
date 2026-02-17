import { describe, test, expect } from 'bun:test';
import { GeoLocation } from '../models/geocoding.model';

/**
 * Test LocationService pure logic patterns without Angular DI or localStorage.
 */

const MAX_RECENTS = 8;

const mockLocation: GeoLocation = {
  name: 'New York',
  latitude: 40.7128,
  longitude: -74.006,
  country: 'United States',
  admin1: 'New York',
  timezone: 'America/New_York',
};

const mockLocation2: GeoLocation = {
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
  country: 'United Kingdom',
  admin1: 'England',
  timezone: 'Europe/London',
};

function deduplicateAndPrepend(list: GeoLocation[], location: GeoLocation): GeoLocation[] {
  const filtered = list.filter(
    r => !(r.latitude === location.latitude && r.longitude === location.longitude)
  );
  filtered.unshift(location);
  return filtered.slice(0, MAX_RECENTS);
}

function isFavorite(favorites: GeoLocation[], location: GeoLocation): boolean {
  return favorites.some(
    f => f.latitude === location.latitude && f.longitude === location.longitude
  );
}

function toggleFavorite(favorites: GeoLocation[], location: GeoLocation): GeoLocation[] {
  const index = favorites.findIndex(
    f => f.latitude === location.latitude && f.longitude === location.longitude
  );
  if (index >= 0) {
    const next = [...favorites];
    next.splice(index, 1);
    return next;
  }
  return [...favorites, location];
}

describe('LocationService recents logic', () => {
  test('adds new location to front of list', () => {
    const result = deduplicateAndPrepend([], mockLocation);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('New York');
  });

  test('deduplicates by coordinates', () => {
    const list = [mockLocation];
    const result = deduplicateAndPrepend(list, mockLocation);
    expect(result.length).toBe(1);
  });

  test('most recent is first', () => {
    const list = [mockLocation];
    const result = deduplicateAndPrepend(list, mockLocation2);
    expect(result[0].name).toBe('London');
    expect(result[1].name).toBe('New York');
  });

  test('caps at MAX_RECENTS', () => {
    const list: GeoLocation[] = [];
    for (let i = 0; i < 10; i++) {
      list.push({ ...mockLocation, name: `City ${i}`, latitude: i });
    }
    const newLoc = { ...mockLocation, name: 'New', latitude: 99 };
    const result = deduplicateAndPrepend(list, newLoc);
    expect(result.length).toBe(MAX_RECENTS);
    expect(result[0].name).toBe('New');
  });
});

describe('LocationService favorites logic', () => {
  test('isFavorite returns true for matching location', () => {
    expect(isFavorite([mockLocation], mockLocation)).toBe(true);
  });

  test('isFavorite returns false for non-matching location', () => {
    expect(isFavorite([mockLocation], mockLocation2)).toBe(false);
  });

  test('isFavorite returns false for empty list', () => {
    expect(isFavorite([], mockLocation)).toBe(false);
  });

  test('toggleFavorite adds when not present', () => {
    const result = toggleFavorite([], mockLocation);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('New York');
  });

  test('toggleFavorite removes when present', () => {
    const result = toggleFavorite([mockLocation], mockLocation);
    expect(result.length).toBe(0);
  });

  test('toggleFavorite does not affect other favorites', () => {
    const result = toggleFavorite([mockLocation, mockLocation2], mockLocation);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('London');
  });
});
