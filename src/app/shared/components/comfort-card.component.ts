import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { CurrentWeather } from '../../core/models/weather.model';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';
import { TemperaturePipe } from '../pipes/temperature.pipe';
import { getComfortAdvice } from '../../core/utils/comfort.utils';

@Component({
  selector: 'app-comfort-card',
  standalone: true,
  imports: [TemperaturePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card comfort-card">
      <h3 class="card-label">What to Wear</h3>
      <div class="comfort-main">
        <div class="comfort-icon" [class]="'level-' + advice().level" aria-hidden="true">
          @switch (advice().icon) {
            @case ('bundle') {
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                <rect x="12" y="8" width="24" height="32" rx="4" fill="currentColor" opacity="0.15"/>
                <path d="M16 16h16M16 22h16M16 28h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="24" cy="40" r="3" fill="currentColor" opacity="0.3"/>
                <path d="M18 8c0-3 2-5 6-5s6 2 6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            }
            @case ('coat') {
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                <path d="M14 12l-4 28h10l2-18 2 18h10l-4-28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 12c0-4 4-7 10-7s10 3 10 7" stroke="currentColor" stroke-width="2"/>
                <line x1="24" y1="18" x2="24" y2="32" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>
              </svg>
            }
            @case ('jacket') {
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                <path d="M16 14l-4 24h8l2-14 2 14h8l-4-24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 14c0-3 3-6 8-6s8 3 8 6" stroke="currentColor" stroke-width="2"/>
              </svg>
            }
            @case ('tshirt') {
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                <path d="M16 10l-8 6 4 4 4-3v23h16V17l4 3 4-4-8-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 10c0-2 3-4 8-4s8 2 8 4" stroke="currentColor" stroke-width="2"/>
              </svg>
            }
            @case ('sunglasses') {
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                <path d="M8 22h32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <ellipse cx="16" cy="26" rx="7" ry="6" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.15"/>
                <ellipse cx="32" cy="26" rx="7" ry="6" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.15"/>
                <path d="M23 24c0-1 1-2 2-2" stroke="currentColor" stroke-width="2"/>
              </svg>
            }
          }
        </div>
        <div class="comfort-info">
          <div class="comfort-temps">
            <span class="feels-value" [class]="'level-' + advice().level">{{ current().apparent_temperature | temperature:units.temperatureSymbol() }}</span>
            <span class="feels-label">feels like</span>
          </div>
          <span class="comfort-summary" [class]="'level-' + advice().level">{{ advice().summary }}</span>
          @if (tempDifference()) {
            <span class="temp-diff">{{ tempDifference() }}</span>
          }
        </div>
      </div>
      <p class="comfort-clothing">{{ advice().clothing }}</p>
    </div>
  `,
  styles: [`
    .comfort-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .card-label {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin: 0;
    }
    .comfort-main {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
    }
    .comfort-icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
    }
    .comfort-icon.level-freezing { color: var(--temp-freezing); }
    .comfort-icon.level-cold { color: var(--temp-cold); }
    .comfort-icon.level-cool { color: var(--temp-cool); }
    .comfort-icon.level-mild { color: var(--temp-mild); }
    .comfort-icon.level-warm { color: var(--temp-warm); }
    .comfort-icon.level-hot { color: var(--temp-hot); }
    .comfort-icon.level-extreme { color: var(--temp-extreme); }
    .comfort-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .comfort-temps {
      display: flex;
      align-items: baseline;
      gap: var(--space-sm);
    }
    .feels-value {
      font-family: var(--font-body);
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 1;
    }
    .feels-value.level-freezing { color: var(--temp-freezing); }
    .feels-value.level-cold { color: var(--temp-cold); }
    .feels-value.level-cool { color: var(--temp-cool); }
    .feels-value.level-mild { color: var(--temp-mild); }
    .feels-value.level-warm { color: var(--temp-warm); }
    .feels-value.level-hot { color: var(--temp-hot); }
    .feels-value.level-extreme { color: var(--temp-extreme); }
    .temp-diff {
      font-size: 0.875rem;
      color: var(--text-tertiary);
    }
    .feels-label {
      font-size: 0.875rem;
      color: var(--text-tertiary);
    }
    .comfort-summary {
      font-size: 1rem;
      font-weight: 600;
    }
    .comfort-summary.level-freezing { color: var(--temp-freezing); }
    .comfort-summary.level-cold { color: var(--temp-cold); }
    .comfort-summary.level-cool { color: var(--temp-cool); }
    .comfort-summary.level-mild { color: var(--temp-mild); }
    .comfort-summary.level-warm { color: var(--temp-warm); }
    .comfort-summary.level-hot { color: var(--temp-hot); }
    .comfort-summary.level-extreme { color: var(--temp-extreme); }
    .comfort-clothing {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }
  `],
})
export class ComfortCardComponent {
  readonly current = input.required<CurrentWeather>();
  readonly precipProbability = input(0);

  protected readonly units = inject(UnitPreferencesService);

  /** Describes difference between actual and feels-like temperature */
  readonly tempDifference = computed(() => {
    const c = this.current();
    const diff = c.apparent_temperature - c.temperature_2m;
    const isFahrenheit = this.units.temperatureUnit() === 'fahrenheit';
    // Convert the difference for display (for °F, multiply by 9/5 since it's a delta)
    const displayDiff = isFahrenheit ? Math.round(diff * 9 / 5) : Math.round(diff);
    if (Math.abs(displayDiff) < 2) return '';
    const symbol = this.units.temperatureSymbol();
    if (displayDiff > 0) return `${displayDiff}${symbol} warmer than actual`;
    return `${Math.abs(displayDiff)}${symbol} colder than actual`;
  });

  readonly advice = computed(() => {
    const c = this.current();
    return getComfortAdvice(
      c.apparent_temperature,
      c.relative_humidity_2m,
      c.wind_speed_10m,
      this.precipProbability(),
    );
  });
}
