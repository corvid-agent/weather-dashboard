const COMPASS_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
] as const;

export type CompassDirection = typeof COMPASS_DIRECTIONS[number];

export function degreesToCompass(degrees: number): CompassDirection {
  const index = Math.round(((degrees % 360 + 360) % 360) / 22.5) % 16;
  return COMPASS_DIRECTIONS[index];
}

export interface BeaufortInfo {
  force: number;
  description: string;
  seaState: string;
}

export function getBeaufortScale(speedKmh: number): BeaufortInfo {
  if (speedKmh < 1) return { force: 0, description: 'Calm', seaState: 'Flat' };
  if (speedKmh < 6) return { force: 1, description: 'Light air', seaState: 'Ripples' };
  if (speedKmh < 12) return { force: 2, description: 'Light breeze', seaState: 'Small wavelets' };
  if (speedKmh < 20) return { force: 3, description: 'Gentle breeze', seaState: 'Large wavelets' };
  if (speedKmh < 29) return { force: 4, description: 'Moderate breeze', seaState: 'Small waves' };
  if (speedKmh < 39) return { force: 5, description: 'Fresh breeze', seaState: 'Moderate waves' };
  if (speedKmh < 50) return { force: 6, description: 'Strong breeze', seaState: 'Large waves' };
  if (speedKmh < 62) return { force: 7, description: 'Near gale', seaState: 'Sea heaps up' };
  if (speedKmh < 75) return { force: 8, description: 'Gale', seaState: 'Moderately high waves' };
  if (speedKmh < 89) return { force: 9, description: 'Strong gale', seaState: 'High waves' };
  if (speedKmh < 103) return { force: 10, description: 'Storm', seaState: 'Very high waves' };
  if (speedKmh < 118) return { force: 11, description: 'Violent storm', seaState: 'Exceptionally high waves' };
  return { force: 12, description: 'Hurricane force', seaState: 'Huge waves' };
}
