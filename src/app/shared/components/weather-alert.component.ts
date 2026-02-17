import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { CurrentWeather } from '../../core/models/weather.model';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';

interface WeatherAlert {
  type: 'warning' | 'danger';
  message: string;
}

const SEVERE_CODES: Record<number, { type: 'warning' | 'danger'; message: string }> = {
  57: { type: 'warning', message: 'Dense freezing drizzle — roads may be icy' },
  65: { type: 'warning', message: 'Heavy rainfall in your area' },
  67: { type: 'danger', message: 'Heavy freezing rain — dangerous road conditions' },
  75: { type: 'warning', message: 'Heavy snowfall expected' },
  82: { type: 'danger', message: 'Violent rain showers — take shelter' },
  86: { type: 'warning', message: 'Heavy snow showers in progress' },
  95: { type: 'danger', message: 'Thunderstorm in your area — stay indoors' },
  96: { type: 'danger', message: 'Thunderstorm with hail — seek shelter immediately' },
  99: { type: 'danger', message: 'Severe thunderstorm with heavy hail — take cover' },
};

@Component({
  selector: 'app-weather-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (alert of alerts(); track alert.message) {
      <div class="alert-banner" [class]="'alert-' + alert.type" role="alert">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          @if (alert.type === 'danger') {
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          } @else {
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          }
        </svg>
        <span class="alert-text">{{ alert.message }}</span>
      </div>
    }
  `,
  styles: [`
    .alert-banner {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius);
      font-size: 0.9rem;
      font-weight: 500;
      animation: slideDown 0.3s ease-out;
    }
    .alert-warning {
      background: rgba(251, 191, 36, 0.15);
      border: 1px solid rgba(251, 191, 36, 0.3);
      color: var(--accent-yellow);
    }
    .alert-danger {
      background: rgba(248, 113, 113, 0.15);
      border: 1px solid rgba(248, 113, 113, 0.3);
      color: var(--accent-red);
    }
    .alert-text { flex: 1; }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class WeatherAlertComponent {
  readonly current = input.required<CurrentWeather>();

  private readonly units = inject(UnitPreferencesService);

  readonly alerts = computed<WeatherAlert[]>(() => {
    const c = this.current();
    const result: WeatherAlert[] = [];

    const severe = SEVERE_CODES[c.weather_code];
    if (severe) {
      result.push({ type: severe.type, message: severe.message });
    }

    // Wind gust thresholds — data is always km/h from API
    const gustsKmh = c.wind_gusts_10m;
    if (gustsKmh > 80 || gustsKmh > 60) {
      const displayGusts = this.convertWind(gustsKmh);
      const windUnit = this.units.windSpeedSymbol();
      const severity = gustsKmh > 80 ? 'Dangerous' : 'Strong';
      result.push({
        type: gustsKmh > 80 ? 'danger' : 'warning',
        message: `${severity} wind gusts of ${Math.round(displayGusts)} ${windUnit}`,
      });
    }

    return result;
  });

  private convertWind(kmh: number): number {
    const wu = this.units.windSpeedUnit();
    if (wu === 'mph') return kmh * 0.621371;
    if (wu === 'ms') return kmh / 3.6;
    if (wu === 'kn') return kmh * 0.539957;
    return kmh;
  }
}
