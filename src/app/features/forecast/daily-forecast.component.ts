import { Component, ChangeDetectionStrategy, inject, signal, effect, computed, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { WeatherService } from '../../core/services/weather.service';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';
import { DailyForecast } from '../../core/models/weather.model';
import { WeatherIconComponent } from '../../shared/components/weather-icon.component';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import { WindSpeedPipe } from '../../shared/pipes/wind-speed.pipe';
import { WindDirectionPipe } from '../../shared/pipes/wind-direction.pipe';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton.component';
import { ErrorCardComponent } from '../../shared/components/error-card.component';
import { formatDay, formatTime, formatDuration } from '../../core/utils/date.utils';
import { getUvCategory } from '../../core/utils/uv.utils';

@Component({
  selector: 'app-daily-forecast',
  standalone: true,
  imports: [RouterLink, WeatherIconComponent, TemperaturePipe, WindSpeedPipe, WindDirectionPipe, LoadingSkeletonComponent, ErrorCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page container">
      <div class="page-header">
        <a routerLink="/" class="back-link">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
          Back
        </a>
        <div class="page-title-wrap">
          <h1 class="page-title">7-Day Forecast</h1>
          @if (locationName()) {
            <span class="page-subtitle">{{ locationName() }}</span>
          }
        </div>
      </div>

      @if (loading()) {
        @for (i of [1,2,3,4,5,6,7]; track i) {
          <app-loading-skeleton height="140px" />
        }
      } @else if (error()) {
        <app-error-card (retry)="reload()" />
      } @else {
        @for (day of days(); track day.date.getTime()) {
          <div class="glass-card day-detail">
            <div class="day-header">
              <app-weather-icon [code]="day.weatherCode" [size]="48" />
              <div class="day-header-text">
                <h3 class="day-name">{{ formatDay(day.date) }}</h3>
                <span class="day-temps">
                  <span class="high">{{ day.tempMax | temperature:units.temperatureSymbol() }}</span>
                  <span class="sep">/</span>
                  <span class="low">{{ day.tempMin | temperature:units.temperatureSymbol() }}</span>
                </span>
              </div>
            </div>
            <div class="day-metrics">
              <div class="metric">
                <span class="metric-label">Precip</span>
                <span class="metric-value">{{ day.precipSum }} {{ units.precipitationSymbol() }} ({{ day.precipProbabilityMax }}%)</span>
              </div>
              <div class="metric">
                <span class="metric-label">Wind</span>
                <span class="metric-value">{{ day.windSpeedMax | windSpeed:units.windSpeedSymbol() }} {{ day.windDirectionDominant | windDirection }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">UV</span>
                <span class="metric-value" [style.color]="getUvColor(day.uvIndexMax)">{{ day.uvIndexMax }} — {{ getUvLevel(day.uvIndexMax) }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Sunrise</span>
                <span class="metric-value">{{ formatTime(day.sunrise) }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Sunset</span>
                <span class="metric-value">{{ formatTime(day.sunset) }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Daylight</span>
                <span class="metric-value">{{ formatDuration(day.daylightDuration) }}</span>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page { padding-top: var(--space-xl); padding-bottom: var(--space-2xl); display: flex; flex-direction: column; gap: var(--space-lg); }
    .page-header { display: flex; align-items: center; gap: var(--space-md); }
    .back-link { display: flex; align-items: center; gap: var(--space-xs); color: var(--text-secondary); font-size: 0.9rem; }
    .back-link:hover { color: var(--accent-gold); }
    .page-title-wrap { display: flex; flex-direction: column; gap: 2px; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .page-subtitle { font-size: 0.85rem; color: var(--text-tertiary); font-family: var(--font-body); }
    .day-detail { display: flex; flex-direction: column; gap: var(--space-md); }
    .day-header { display: flex; align-items: center; gap: var(--space-md); }
    .day-header-text { display: flex; flex-direction: column; }
    .day-name { font-size: 1.1rem; font-weight: 600; margin: 0; }
    .day-temps { font-size: 1.3rem; font-weight: 700; }
    .high { color: var(--accent-orange); }
    .sep { color: var(--text-tertiary); margin: 0 4px; }
    .low { color: var(--accent-blue); }
    .day-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-sm); }
    .metric { display: flex; flex-direction: column; gap: 2px; }
    .metric-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary); }
    .metric-value { font-size: 0.9rem; font-weight: 500; }
    @media (max-width: 480px) { .day-metrics { grid-template-columns: repeat(2, 1fr); } }
  `],
})
export class DailyForecastComponent implements OnInit {
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);
  readonly locationName = computed(() => this.locationService.active()?.name ?? '');

  ngOnInit(): void {
    if (!this.locationService.active()) this.router.navigate(['/']);
  }
  private readonly weatherService = inject(WeatherService);
  protected readonly units = inject(UnitPreferencesService);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly days = signal<DailyForecast[]>([]);

  readonly formatDay = formatDay;
  readonly formatTime = formatTime;
  readonly formatDuration = formatDuration;

  constructor() {
    effect(() => {
      const loc = this.locationService.active();
      if (loc) this.load(loc.latitude, loc.longitude);
    });
  }

  reload(): void {
    const loc = this.locationService.active();
    if (loc) this.load(loc.latitude, loc.longitude);
  }

  getUvColor(index: number): string {
    return getUvCategory(index).color;
  }

  getUvLevel(index: number): string {
    return getUvCategory(index).level;
  }

  private load(lat: number, lon: number): void {
    this.loading.set(true);
    this.error.set(false);
    this.weatherService.loadForecast(lat, lon).subscribe({
      next: res => {
        this.days.set(this.weatherService.parseDailyForecasts(res));
        this.loading.set(false);
      },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
