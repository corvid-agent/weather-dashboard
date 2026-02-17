export interface AqiCategory {
  level: string;
  color: string;
  recommendation: string;
}

export function getAqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50) return { level: 'Good', color: 'var(--aqi-good)', recommendation: 'Air quality is satisfactory.' };
  if (aqi <= 100) return { level: 'Moderate', color: 'var(--aqi-moderate)', recommendation: 'Acceptable. Sensitive individuals should limit prolonged outdoor exertion.' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'var(--aqi-unhealthy-sensitive)', recommendation: 'Sensitive groups should reduce prolonged outdoor exertion.' };
  if (aqi <= 200) return { level: 'Unhealthy', color: 'var(--aqi-unhealthy)', recommendation: 'Everyone may begin to experience health effects.' };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: 'var(--aqi-very-unhealthy)', recommendation: 'Health alert: everyone may experience serious health effects.' };
  return { level: 'Hazardous', color: 'var(--aqi-hazardous)', recommendation: 'Health warning of emergency conditions.' };
}

export function getAqiPercent(aqi: number): number {
  return Math.min((aqi / 500) * 100, 100);
}
