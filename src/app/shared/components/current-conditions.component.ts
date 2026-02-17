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
          <span class="temp-value">{{ current().temperature_2m | temperature:units.temperatureSymbol() }}</span>
          <span class="temp-desc">{{ weatherDescription() }}</span>
          <span class="temp-feels">Feels like {{ current().apparent_temperature | temperature:units.temperatureSymbol() }}</span>
        </div>
      </div>

      <div class="hero-details">
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">{{ current().relative_humidity_2m }}%</span>
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
      font-family: var(--font-heading);
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
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
    }
    .detail-value {
      font-size: 1rem;
      font-weight: 600;
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
}
