import { Component, ChangeDetectionStrategy, input, inject, computed } from '@angular/core';
import { CurrentWeather } from '../../core/models/weather.model';
import { WeatherIconComponent } from './weather-icon.component';
import { TemperaturePipe } from '../pipes/temperature.pipe';
import { WindSpeedPipe } from '../pipes/wind-speed.pipe';
import { WindDirectionPipe } from '../pipes/wind-direction.pipe';
import { PressurePipe } from '../pipes/pressure.pipe';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';
import { getWeatherInfo } from '../../core/models/weather-codes';

@Component({
  selector: 'app-current-conditions',
  standalone: true,
  imports: [WeatherIconComponent, TemperaturePipe, WindSpeedPipe, WindDirectionPipe, PressurePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card hero-card">
      <div class="hero-main">
        <app-weather-icon [code]="current().weather_code" [isDay]="isDay()" [size]="96" />
        <div class="hero-temp">
          <span class="temp-value" [style.color]="tempColor()">{{ current().temperature_2m | temperature:units.temperatureSymbol() }}</span>
          <span class="temp-desc">{{ weatherDescription() }}</span>
          <span class="temp-feels">Feels like {{ current().apparent_temperature | temperature:units.temperatureSymbol() }}</span>
        </div>
      </div>

      <div class="hero-details">
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">{{ current().relative_humidity_2m }}%</span>
          <span class="detail-sub">{{ humidityComfort() }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wind</span>
          <span class="detail-value">{{ current().wind_speed_10m | windSpeed:units.windSpeedSymbol() }} {{ current().wind_direction_10m | windDirection }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Gusts</span>
          <span class="detail-value">{{ current().wind_gusts_10m | windSpeed:units.windSpeedSymbol() }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Pressure</span>
          <span class="detail-value">{{ current().pressure_msl | pressure }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Cloud Cover</span>
          <span class="detail-value">{{ current().cloud_cover }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Dew Point</span>
          <span class="detail-value">{{ current().dew_point_2m | temperature:units.temperatureSymbol() }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Visibility</span>
          <span class="detail-value">{{ formatVisibility(current().visibility) }}</span>
        </div>
        @if (current().precipitation > 0 || current().rain > 0 || current().snowfall > 0) {
          <div class="detail-item">
            <span class="detail-label">Precipitation</span>
            <span class="detail-value">{{ formatPrecip(current().precipitation) }}</span>
          </div>
          @if (current().snowfall > 0) {
            <div class="detail-item">
              <span class="detail-label">Snowfall</span>
              <span class="detail-value">{{ formatPrecip(current().snowfall) }}</span>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .hero-card { padding: var(--space-xl); }
    .hero-main {
      display: flex;
      align-items: center;
      gap: var(--space-xl);
      margin-bottom: var(--space-xl);
    }
    .hero-temp { display: flex; flex-direction: column; }
    .temp-value {
      font-family: var(--font-body);
      font-size: 4rem;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -2px;
    }
    .temp-desc {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-top: var(--space-xs);
    }
    .temp-feels {
      font-size: 0.9rem;
      color: var(--text-tertiary);
      margin-top: var(--space-xs);
    }
    .hero-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-md);
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .detail-label {
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
    }
    .detail-value {
      font-size: 1rem;
      font-weight: 600;
    }
    .detail-sub {
      font-size: 0.875rem;
      color: var(--text-tertiary);
      font-style: italic;
    }
    @media (max-width: 640px) {
      .hero-main { gap: var(--space-lg); }
      .temp-value { font-size: 3rem; }
      .hero-details { grid-template-columns: repeat(2, 1fr); }
    }
  `],
})
export class CurrentConditionsComponent {
  readonly current = input.required<CurrentWeather>();

  protected readonly units = inject(UnitPreferencesService);

  readonly isDay = computed(() => this.current().is_day === 1);
  readonly weatherDescription = computed(() => getWeatherInfo(this.current().weather_code, this.isDay()).description);

  /** Color based on Celsius value (API always returns Celsius) */
  readonly tempColor = computed(() => {
    const c = this.current().temperature_2m;
    if (c <= -15) return 'var(--temp-freezing)';
    if (c <= -5) return 'var(--temp-freezing)';
    if (c <= 2) return 'var(--temp-cold)';
    if (c <= 10) return 'var(--temp-cool)';
    if (c <= 22) return 'var(--temp-mild)';
    if (c <= 28) return 'var(--temp-warm)';
    if (c <= 35) return 'var(--temp-hot)';
    return 'var(--temp-extreme)';
  });

  readonly humidityComfort = computed(() => {
    const h = this.current().relative_humidity_2m;
    if (h < 25) return 'Very dry';
    if (h < 40) return 'Dry';
    if (h <= 60) return 'Comfortable';
    if (h <= 75) return 'Humid';
    return 'Very humid';
  });

  /** Convert mm to user's preferred unit */
  formatPrecip(mm: number): string {
    if (this.units.precipitationUnit() === 'inch') {
      return (mm / 25.4).toFixed(2) + ' in';
    }
    return mm.toFixed(1) + ' mm';
  }

  formatVisibility(meters: number): string {
    if (!meters && meters !== 0) return '—';
    if (meters >= 10000) return (meters / 1000).toFixed(0) + ' km';
    if (meters >= 1000) return (meters / 1000).toFixed(1) + ' km';
    return meters.toFixed(0) + ' m';
  }
}
