import { Component, ChangeDetectionStrategy, inject, signal, effect, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { WeatherService } from '../../core/services/weather.service';
import { AirQualityService } from '../../core/services/air-quality.service';
import { HistoricalService, HistoricalComparison } from '../../core/services/historical.service';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';
import { ForecastResponse, HourlyForecast, DailyForecast } from '../../core/models/weather.model';
import { AirQualityResponse } from '../../core/models/air-quality.model';
import { LocationSearchComponent } from '../../shared/components/location-search.component';
import { CurrentConditionsComponent } from '../../shared/components/current-conditions.component';
import { HourlyChartComponent } from '../../shared/components/hourly-chart.component';
import { DailyRowComponent } from '../../shared/components/daily-row.component';
import { PrecipitationChartComponent } from '../../shared/components/precipitation-chart.component';
import { WindCompassComponent } from '../../shared/components/wind-compass.component';
import { UvMeterComponent } from '../../shared/components/uv-meter.component';
import { AstronomyCardComponent } from '../../shared/components/astronomy-card.component';
import { AqiGaugeComponent } from '../../shared/components/aqi-gauge.component';
import { HistoricalComparisonComponent } from '../../shared/components/historical-comparison.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton.component';
import { ErrorCardComponent } from '../../shared/components/error-card.component';
import { getBackgroundGradient } from '../../core/utils/gradient.utils';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    LocationSearchComponent, CurrentConditionsComponent, HourlyChartComponent,
    DailyRowComponent, PrecipitationChartComponent, WindCompassComponent,
    UvMeterComponent, AstronomyCardComponent, AqiGaugeComponent,
    HistoricalComparisonComponent, LoadingSkeletonComponent, ErrorCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard">
      @if (state() === 'idle') {
        <div class="welcome fade-in">
          <div class="welcome-icon">
            <svg viewBox="0 0 64 64" width="80" height="80" fill="none">
              <circle cx="32" cy="28" r="12" fill="#fbbf24" opacity="0.9"/>
              <ellipse cx="36" cy="44" rx="20" ry="12" fill="#94a3b8" opacity="0.7"/>
              <ellipse cx="28" cy="40" rx="14" ry="10" fill="#cbd5e1" opacity="0.8"/>
            </svg>
          </div>
          <h1 class="welcome-title">Weather Dashboard</h1>
          <p class="welcome-text">Search for a city or use your location to get started</p>
          <div class="welcome-search">
            <app-location-search />
          </div>
        </div>
      }

      @if (state() === 'loading') {
        <div class="loading-grid">
          <app-loading-skeleton height="280px" />
          <app-loading-skeleton height="220px" />
          <div class="weather-grid">
            <app-loading-skeleton height="180px" />
            <app-loading-skeleton height="180px" />
            <app-loading-skeleton height="180px" />
          </div>
        </div>
      }

      @if (state() === 'error') {
        <app-error-card title="Failed to load weather" message="Could not fetch weather data. Please check your connection and try again." (retry)="reload()" />
      }

      @if (state() === 'loaded' && forecast()) {
        <div class="loaded-content slide-up">
          <app-current-conditions [current]="forecast()!.current" />

          <section class="section">
            <div class="section-header">
              <h2 class="section-title">Hourly Forecast</h2>
              <button class="btn-secondary" (click)="router.navigate(['/hourly'])">See All</button>
            </div>
            <app-hourly-chart [hours]="hourlyForecasts()" />
          </section>

          <section class="section">
            <div class="section-header">
              <h2 class="section-title">7-Day Forecast</h2>
              <button class="btn-secondary" (click)="router.navigate(['/daily'])">See All</button>
            </div>
            <app-daily-row [days]="dailyForecasts()" />
          </section>

          <section class="section">
            <app-precipitation-chart [hours]="hourlyForecasts()" />
          </section>

          <div class="weather-grid">
            <app-wind-compass
              [direction]="forecast()!.current.wind_direction_10m"
              [speed]="forecast()!.current.wind_speed_10m"
              [gusts]="forecast()!.current.wind_gusts_10m" />

            @if (todayForecast()) {
              <app-uv-meter [index]="todayForecast()!.uvIndexMax" />
              <app-astronomy-card [today]="todayForecast()!" />
            }

            @if (airQuality()?.current?.us_aqi) {
              <app-aqi-gauge [value]="airQuality()!.current.us_aqi" />
            }

            @if (historicalData().length > 0) {
              <app-historical-comparison [comparisons]="historicalData()" />
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: var(--space-lg);
    }
    .welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - var(--header-height) - 100px);
      text-align: center;
      gap: var(--space-lg);
    }
    .welcome-title {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -1px;
    }
    .welcome-text {
      color: var(--text-secondary);
      font-size: 1.1rem;
      max-width: 400px;
    }
    .welcome-search { width: 100%; max-width: 400px; }
    .loading-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
      padding-top: var(--space-xl);
    }
    .loaded-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }
    .section {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .section-title { margin: 0; }
    @media (max-width: 640px) {
      .dashboard { padding: var(--space-md); }
      .welcome-title { font-size: 1.8rem; }
    }
  `],
})
export class DashboardComponent {
  readonly router = inject(Router);
  private readonly locationService = inject(LocationService);
  private readonly weatherService = inject(WeatherService);
  private readonly airQualityService = inject(AirQualityService);
  private readonly historicalService = inject(HistoricalService);
  private readonly units = inject(UnitPreferencesService);

  readonly state = signal<LoadState>('idle');
  readonly forecast = signal<ForecastResponse | null>(null);
  readonly airQuality = signal<AirQualityResponse | null>(null);
  readonly historicalData = signal<HistoricalComparison[]>([]);

  readonly hourlyForecasts = computed(() => {
    const f = this.forecast();
    return f ? this.weatherService.parseHourlyForecasts(f) : [];
  });

  readonly dailyForecasts = computed(() => {
    const f = this.forecast();
    return f ? this.weatherService.parseDailyForecasts(f) : [];
  });

  readonly todayForecast = computed(() => this.dailyForecasts()[0] ?? null);

  readonly bgGradient = computed(() => {
    const f = this.forecast();
    if (!f) return 'var(--gradient-clear-day)';
    return getBackgroundGradient(f.current.weather_code, f.current.is_day === 1);
  });

  constructor() {
    effect(() => {
      const loc = this.locationService.active();
      if (loc) {
        this.loadWeather(loc.latitude, loc.longitude);
      }
    });

    effect(() => {
      const bg = this.bgGradient();
      document.querySelector('.weather-bg')?.setAttribute('style', 'background: ' + bg);
    });
  }

  reload(): void {
    const loc = this.locationService.active();
    if (loc) {
      this.loadWeather(loc.latitude, loc.longitude);
    }
  }

  private loadWeather(lat: number, lon: number): void {
    this.state.set('loading');

    this.weatherService.loadForecast(lat, lon).subscribe({
      next: res => {
        this.forecast.set(res);
        this.state.set('loaded');
      },
      error: () => this.state.set('error'),
    });

    this.airQualityService.loadAirQuality(lat, lon).subscribe({
      next: res => this.airQuality.set(res),
      error: () => {},
    });

    this.historicalService.loadHistorical(lat, lon).subscribe({
      next: res => {
        if (res?.daily) {
          const d = res.daily;
          const avgMax = d.temperature_2m_max.reduce((a: number, b: number) => a + b, 0) / d.temperature_2m_max.length;
          const avgMin = d.temperature_2m_min.reduce((a: number, b: number) => a + b, 0) / d.temperature_2m_min.length;
          const avgPrecip = d.precipitation_sum.reduce((a: number, b: number) => a + b, 0) / d.precipitation_sum.length;
          const avgWind = d.wind_speed_10m_max.reduce((a: number, b: number) => a + b, 0) / d.wind_speed_10m_max.length;

          const current = this.forecast();
          if (!current) return;

          const tempUnit = this.units.temperatureSymbol();
          const windUnit = this.units.windSpeedSymbol();
          const precipUnit = this.units.precipitationSymbol();

          const comparisons: HistoricalComparison[] = [
            {
              metric: 'High Temp',
              current: current.daily.temperature_2m_max[0],
              historical: avgMax,
              unit: tempUnit,
              diff: current.daily.temperature_2m_max[0] - avgMax,
              diffPercent: avgMax ? ((current.daily.temperature_2m_max[0] - avgMax) / Math.abs(avgMax)) * 100 : 0,
            },
            {
              metric: 'Low Temp',
              current: current.daily.temperature_2m_min[0],
              historical: avgMin,
              unit: tempUnit,
              diff: current.daily.temperature_2m_min[0] - avgMin,
              diffPercent: avgMin ? ((current.daily.temperature_2m_min[0] - avgMin) / Math.abs(avgMin)) * 100 : 0,
            },
            {
              metric: 'Precipitation',
              current: current.daily.precipitation_sum[0],
              historical: avgPrecip,
              unit: precipUnit,
              diff: current.daily.precipitation_sum[0] - avgPrecip,
              diffPercent: avgPrecip ? ((current.daily.precipitation_sum[0] - avgPrecip) / avgPrecip) * 100 : 0,
            },
            {
              metric: 'Wind Speed',
              current: current.daily.wind_speed_10m_max[0],
              historical: avgWind,
              unit: windUnit,
              diff: current.daily.wind_speed_10m_max[0] - avgWind,
              diffPercent: avgWind ? ((current.daily.wind_speed_10m_max[0] - avgWind) / avgWind) * 100 : 0,
            },
          ];
          this.historicalData.set(comparisons);
        }
      },
      error: () => {},
    });
  }
}
