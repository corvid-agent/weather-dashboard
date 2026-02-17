import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';

@Component({
  selector: 'app-humidity-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card humidity-card">
      <h3 class="card-label">Humidity</h3>
      <div class="gauge-wrap">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <!-- Background circle -->
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" stroke-width="8"
                  stroke-dasharray="235.6" stroke-dashoffset="0"
                  transform="rotate(-90 60 60)" stroke-linecap="round" />
          <!-- Fill circle -->
          <circle cx="60" cy="60" r="50" fill="none" [attr.stroke]="ringColor()" stroke-width="8"
                  stroke-dasharray="235.6" [attr.stroke-dashoffset]="dashOffset()"
                  transform="rotate(-90 60 60)" stroke-linecap="round"
                  style="transition: stroke-dashoffset 0.6s ease, stroke 0.3s ease" />
          <!-- Droplet icon -->
          <path d="M60 32 l8 14a10 10 0 1 1 -16 0 Z" [attr.fill]="ringColor()" opacity="0.3"/>
          <!-- Value -->
          <text x="60" y="72" text-anchor="middle" fill="var(--text-primary)" font-size="22" font-weight="700">{{ humidity() }}%</text>
        </svg>
      </div>
      <span class="comfort-label" [style.color]="ringColor()">{{ comfortLabel() }}</span>
      <span class="dew-point">Dew point {{ dewPointDisplay() }}</span>
    </div>
  `,
  styles: [`
    .humidity-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-sm);
    }
    .card-label {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin: 0;
    }
    .gauge-wrap { margin: var(--space-xs) 0; }
    .comfort-label { font-size: 0.95rem; font-weight: 600; }
    .dew-point { font-size: 0.8rem; color: var(--text-tertiary); }
  `],
})
export class HumidityCardComponent {
  readonly humidity = input.required<number>();
  readonly dewPoint = input(0);   // always Celsius from API

  private readonly units = inject(UnitPreferencesService);

  readonly dewPointDisplay = computed(() => {
    const c = this.dewPoint();
    if (this.units.temperatureUnit() === 'fahrenheit') {
      return Math.round(c * 9 / 5 + 32) + '°F';
    }
    return Math.round(c) + '°C';
  });

  /** Stroke-dashoffset: full circle = 235.6 (2 * PI * 50 * (3/4ish)) */
  readonly dashOffset = computed(() => {
    const circumference = 2 * Math.PI * 50; // ~314.16
    const pct = this.humidity() / 100;
    return circumference * (1 - pct);
  });

  readonly ringColor = computed(() => {
    const h = this.humidity();
    if (h < 25) return 'var(--temp-hot)';       // too dry — orange
    if (h < 40) return 'var(--temp-warm)';       // dry — yellow
    if (h <= 60) return 'var(--temp-mild)';      // comfortable — green
    if (h <= 75) return 'var(--temp-cool)';      // humid — cyan
    return 'var(--accent-blue)';                  // very humid — blue
  });

  readonly comfortLabel = computed(() => {
    const h = this.humidity();
    if (h < 25) return 'Very Dry';
    if (h < 40) return 'Dry';
    if (h <= 60) return 'Comfortable';
    if (h <= 75) return 'Humid';
    return 'Very Humid';
  });
}
