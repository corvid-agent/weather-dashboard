import { Injectable, signal, computed } from '@angular/core';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'kn';
export type PrecipitationUnit = 'mm' | 'inch';

export interface UnitPreferences {
  temperature: TemperatureUnit;
  windSpeed: WindSpeedUnit;
  precipitation: PrecipitationUnit;
}

const STORAGE_KEY = 'weather-units';

/** Countries that primarily use Fahrenheit / mph / inches */
const IMPERIAL_LOCALES = ['en-US', 'en-us'];

function detectDefaults(): UnitPreferences {
  try {
    const locale = navigator.language || '';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const isUS = IMPERIAL_LOCALES.includes(locale) || tz.startsWith('America/') || tz.startsWith('US/');
    if (isUS) {
      return { temperature: 'fahrenheit', windSpeed: 'mph', precipitation: 'inch' };
    }
  } catch { /* noop */ }
  return { temperature: 'celsius', windSpeed: 'kmh', precipitation: 'mm' };
}

@Injectable({ providedIn: 'root' })
export class UnitPreferencesService {
  readonly prefs = signal<UnitPreferences>(this.load());

  readonly temperatureUnit = computed(() => this.prefs().temperature);
  readonly windSpeedUnit = computed(() => this.prefs().windSpeed);
  readonly precipitationUnit = computed(() => this.prefs().precipitation);

  readonly temperatureSymbol = computed(() => this.prefs().temperature === 'celsius' ? '°C' : '°F');
  readonly windSpeedSymbol = computed(() => {
    const map: Record<WindSpeedUnit, string> = { kmh: 'km/h', mph: 'mph', ms: 'm/s', kn: 'kn' };
    return map[this.prefs().windSpeed];
  });
  readonly precipitationSymbol = computed(() => this.prefs().precipitation === 'mm' ? 'mm' : 'in');

  setTemperature(unit: TemperatureUnit): void {
    this.update({ temperature: unit });
  }

  setWindSpeed(unit: WindSpeedUnit): void {
    this.update({ windSpeed: unit });
  }

  setPrecipitation(unit: PrecipitationUnit): void {
    this.update({ precipitation: unit });
  }

  private update(partial: Partial<UnitPreferences>): void {
    const next = { ...this.prefs(), ...partial };
    this.prefs.set(next);
    this.save(next);
  }

  private load(): UnitPreferences {
    const defaults = detectDefaults();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch { /* noop */ }
    return defaults;
  }

  private save(prefs: UnitPreferences): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { /* noop */ }
  }
}
