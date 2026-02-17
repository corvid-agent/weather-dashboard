import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { DailyForecast } from '../../core/models/weather.model';
import { WeatherIconComponent } from './weather-icon.component';
import { TemperaturePipe } from '../pipes/temperature.pipe';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';
import { formatDayShort } from '../../core/utils/date.utils';

@Component({
  selector: 'app-daily-card',
  standalone: true,
  imports: [WeatherIconComponent, TemperaturePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card-sm daily-card">
      <span class="day-name">{{ dayLabel() }}</span>
      <app-weather-icon [code]="day().weatherCode" [size]="36" />
      <div class="temp-range">
        <span class="temp-high">{{ day().tempMax | temperature:units.temperatureSymbol() }}</span>
        <div class="temp-bar">
          <div class="temp-fill" [style.left]="barLeft()" [style.right]="barRight()"></div>
        </div>
        <span class="temp-low">{{ day().tempMin | temperature:units.temperatureSymbol() }}</span>
      </div>
      @if (day().precipProbabilityMax > 0) {
        <span class="precip-chance">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="var(--accent-blue)">
            <path d="M8 2l4 8a4.5 4.5 0 11-8 0l4-8z"/>
          </svg>
          {{ day().precipProbabilityMax }}%
        </span>
      }
    </div>
  `,
  styles: [`
    .daily-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-sm);
      min-width: 100px;
      padding: var(--space-md);
    }
    .day-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .temp-range {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      width: 100%;
    }
    .temp-high { font-weight: 600; font-size: 0.9rem; }
    .temp-low { color: var(--text-tertiary); font-size: 0.85rem; }
    .temp-bar {
      flex: 1;
      height: 4px;
      background: var(--bg-surface);
      border-radius: 2px;
      position: relative;
      overflow: hidden;
    }
    .temp-fill {
      position: absolute;
      top: 0;
      bottom: 0;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-orange));
      border-radius: 2px;
    }
    .precip-chance {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: var(--accent-blue);
    }
  `],
})
export class DailyCardComponent {
  readonly day = input.required<DailyForecast>();
  readonly weekMin = input(0);
  readonly weekMax = input(30);

  protected readonly units = inject(UnitPreferencesService);

  dayLabel(): string {
    return formatDayShort(this.day().date);
  }

  barLeft(): string {
    const range = this.weekMax() - this.weekMin() || 1;
    return ((this.day().tempMin - this.weekMin()) / range * 100) + '%';
  }

  barRight(): string {
    const range = this.weekMax() - this.weekMin() || 1;
    return (100 - (this.day().tempMax - this.weekMin()) / range * 100) + '%';
  }
}
