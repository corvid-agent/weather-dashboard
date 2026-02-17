export interface UvCategory {
  level: string;
  color: string;
  recommendation: string;
}

export function getUvCategory(index: number): UvCategory {
  if (index < 3) return { level: 'Low', color: 'var(--uv-low)', recommendation: 'No protection needed. Enjoy the outdoors!' };
  if (index < 6) return { level: 'Moderate', color: 'var(--uv-moderate)', recommendation: 'Wear sunscreen and sunglasses.' };
  if (index < 8) return { level: 'High', color: 'var(--uv-high)', recommendation: 'Reduce sun exposure between 10am and 4pm.' };
  if (index < 11) return { level: 'Very High', color: 'var(--uv-very-high)', recommendation: 'Minimize sun exposure. Seek shade.' };
  return { level: 'Extreme', color: 'var(--uv-extreme)', recommendation: 'Avoid sun exposure. Stay indoors if possible.' };
}

export function getUvPercent(index: number): number {
  return Math.min((index / 14) * 100, 100);
}
