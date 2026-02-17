import { Component, ChangeDetectionStrategy, inject, signal, effect, computed, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { WeatherService } from '../../core/services/weather.service';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';
import { HourlyForecast } from '../../core/models/weather.model';
import { HourlyChartComponent } from '../../shared/components/hourly-chart.component';
import { WeatherIconComponent } from '../../shared/components/weather-icon.component';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import { WindSpeedPipe } from '../../shared/pipes/wind-speed.pipe';
import { WindDirectionPipe } from '../../shared/pipes/wind-direction.pipe';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton.component';
import { ErrorCardComponent } from '../../shared/components/error-card.component';
import { formatHour } from '../../core/utils/date.utils';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [RouterLink, HourlyChartComponent, WeatherIconComponent, TemperaturePipe, WindSpeedPipe, WindDirectionPipe, LoadingSkeletonComponent, ErrorCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page container">
      <div class="page-header">
        <a routerLink="/" class="back-link">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
          Back
        </a>
        <div class="page-title-wrap">
          <h1 class="page-title">48-Hour Forecast</h1>
          @if (locationName()) {
            <span class="page-subtitle">{{ locationName() }}</span>
          }
        </div>
      </div>

      @if (loading()) {
        <app-loading-skeleton height="200px" />
        <app-loading-skeleton height="400px" />
      } @else if (error()) {
        <app-error-card (retry)="reload()" />
      } @else if (hours().length) {
        <app-hourly-chart [hours]="hours()" />

        <div class="hourly-table glass-card">
          <div class="table-header">
            <span>Time</span>
            <span></span>
            <span>Temp</span>
            <span>Feels</span>
            <span>Precip</span>
            <span>Rain</span>
            <span>Wind</span>
            <span>Hum</span>
          </div>
          @for (h of hours(); track h.time.getTime()) {
            <div class="table-row" [class.night-row]="!h.isDay">
              <span class="time-col">{{ formatHour(h.time) }}</span>
              <span class="icon-col"><app-weather-icon [code]="h.weatherCode" [isDay]="h.isDay" [size]="24" /></span>
              <span class="temp-col">{{ h.temperature | temperature:units.temperatureSymbol() }}</span>
              <span class="feels-col">{{ h.feelsLike | temperature:units.temperatureSymbol() }}</span>
              <span class="precip-col">{{ h.precipProbability }}%</span>
              <span class="rain-col">{{ formatPrecip(h.precipitation) }}</span>
              <span class="wind-col">{{ h.windSpeed | windSpeed:units.windSpeedSymbol() }} {{ h.windDirection | windDirection }}</span>
              <span class="hum-col">{{ h.humidity }}%</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding-top: var(--space-xl); padding-bottom: var(--space-2xl); display: flex; flex-direction: column; gap: var(--space-xl); }
    .page-header { display: flex; align-items: center; gap: var(--space-md); }
    .back-link { display: flex; align-items: center; gap: var(--space-xs); color: var(--text-secondary); font-size: 0.9rem; }
    .back-link:hover { color: var(--accent-gold); }
    .page-title-wrap { display: flex; flex-direction: column; gap: 2px; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .page-subtitle { font-size: 0.85rem; color: var(--text-tertiary); font-family: var(--font-body); }
    .hourly-table { padding: 0; overflow-x: auto; }
    .table-header, .table-row {
      display: grid;
      grid-template-columns: 70px 40px 70px 70px 55px 55px 110px 50px;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      align-items: center;
      font-size: 0.85rem;
    }
    .table-header {
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.75rem;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      background: var(--bg-raised);
      backdrop-filter: blur(12px);
    }
    .table-row { border-bottom: 1px solid var(--border); }
    .table-row:last-child { border-bottom: none; }
    .time-col { font-weight: 600; }
    .temp-col { font-weight: 600; }
    .precip-col { color: var(--accent-blue); }
    .rain-col { font-size: 0.8rem; color: var(--text-secondary); }
    .night-row { background: rgba(0, 0, 0, 0.15); }
    @media (max-width: 640px) {
      .table-header, .table-row { grid-template-columns: 55px 30px 52px 52px 45px 45px 80px 40px; font-size: 0.75rem; padding: var(--space-xs) var(--space-sm); }
    }
  `],
})
export class HourlyForecastComponent implements OnInit {
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
  readonly hours = signal<HourlyForecast[]>([]);

  readonly formatHour = formatHour;

  formatPrecip(mm: number): string {
    if (!mm) return '—';
    if (this.units.precipitationUnit() === 'inch') {
      return (mm / 25.4).toFixed(2) + '"';
    }
    return mm.toFixed(1) + '';
  }

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

  private load(lat: number, lon: number): void {
    this.loading.set(true);
    this.error.set(false);
    this.weatherService.loadForecast(lat, lon).subscribe({
      next: res => {
        this.hours.set(this.weatherService.parseHourlyForecasts(res));
        this.loading.set(false);
      },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
