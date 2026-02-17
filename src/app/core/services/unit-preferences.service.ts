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

const DEFAULT_PREFS: UnitPreferences = {
  temperature: 'celsius',
  windSpeed: 'kmh',
  precipitation: 'mm',
};

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
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
    } catch { /* noop */ }
    return { ...DEFAULT_PREFS };
  }

  private save(prefs: UnitPreferences): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { /* noop */ }
  }
}
