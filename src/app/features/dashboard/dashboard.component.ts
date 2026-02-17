import { Component, ChangeDetectionStrategy, inject, signal, effect, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { WeatherService } from '../../core/services/weather.service';
import { AirQualityService } from '../../core/services/air-quality.service';
import { HistoricalService, HistoricalComparison } from '../../core/services/historical.service';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';
import { GeoLocation } from '../../core/models/geocoding.model';
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
              <circle cx="32" cy="28" r="12" fill="var(--accent-gold)" opacity="0.9"/>
              <ellipse cx="36" cy="44" rx="20" ry="12" fill="var(--text-tertiary)" opacity="0.5"/>
              <ellipse cx="28" cy="40" rx="14" ry="10" fill="var(--text-secondary)" opacity="0.4"/>
            </svg>
          </div>
          <h1 class="welcome-title">Weather Dashboard</h1>
          <p class="welcome-text">Search for a city or use your location to get started</p>
          <div class="welcome-search">
            <app-location-search />
          </div>
          @if (recentLocations().length > 0) {
            <div class="welcome-recents">
              <span class="recents-label">Recent</span>
              <div class="recents-chips">
                @for (loc of recentLocations(); track loc.latitude + ',' + loc.longitude) {
                  <button class="recent-chip" (click)="goToLocation(loc)">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ loc.name }}
                  </button>
                }
              </div>
            </div>
          }
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
          <!-- Location header -->
          <div class="location-bar">
            <div class="location-info">
              <h2 class="location-name">{{ locationName() }}</h2>
              <span class="location-detail">
                {{ locationDetail() }}
                @if (lastUpdated()) {
                  <span class="updated-time">Updated {{ formatUpdated(lastUpdated()!) }}</span>
                }
              </span>
            </div>
            <div class="location-actions">
              <button class="btn-icon refresh-btn" (click)="reload()" aria-label="Refresh weather data" [class.spinning]="state() === 'loading'">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
              </button>
              <button class="btn-icon fav-btn" (click)="toggleFavorite()" [attr.aria-label]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'">
                @if (isFavorite()) {
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="var(--accent-gold)" stroke="var(--accent-gold)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                } @else {
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--text-tertiary)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                }
              </button>
            </div>
          </div>

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
      font-family: var(--font-heading);
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .welcome-text {
      color: var(--text-secondary);
      font-size: 1.1rem;
      max-width: 400px;
    }
    .welcome-search { width: 100%; max-width: 400px; }
    .welcome-recents {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-sm);
      margin-top: var(--space-md);
    }
    .recents-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-tertiary);
      font-weight: 600;
    }
    .recents-chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      justify-content: center;
    }
    .recent-chip {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-md);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-size: 0.85rem;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
    }
    .recent-chip:hover {
      background: var(--accent-gold-dim);
      border-color: var(--accent-gold);
      color: var(--accent-gold);
    }
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
    .location-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--space-md);
    }
    .location-info { display: flex; flex-direction: column; gap: 2px; }
    .location-name {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }
    .location-detail {
      font-size: 0.85rem;
      color: var(--text-tertiary);
    }
    .location-actions {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }
    .refresh-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius);
      color: var(--text-tertiary);
      transition: color 0.2s;
    }
    .refresh-btn:hover { color: var(--text-primary); }
    .refresh-btn.spinning svg { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .fav-btn {
      width: 44px;
      height: 44px;
      border-radius: var(--radius);
      transition: transform 0.2s;
    }
    .fav-btn:hover { transform: scale(1.15); }
    .fav-btn:active { transform: scale(0.95); }
    .updated-time { margin-left: 6px; }
    .updated-time::before { content: '\\00B7'; margin-right: 6px; }
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
      .location-name { font-size: 1.3rem; }
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
  readonly lastUpdated = signal<Date | null>(null);

  readonly locationName = computed(() => this.locationService.active()?.name ?? '');
  readonly locationDetail = computed(() => {
    const loc = this.locationService.active();
    if (!loc) return '';
    const parts: string[] = [];
    if (loc.admin1) parts.push(loc.admin1);
    if (loc.country) parts.push(loc.country);
    return parts.join(', ');
  });

  readonly recentLocations = computed(() => this.locationService.recents().slice(0, 5));

  readonly isFavorite = computed(() => {
    const loc = this.locationService.active();
    if (!loc) return false;
    // Access favorites signal to make this reactive
    return this.locationService.favorites().some(
      f => f.latitude === loc.latitude && f.longitude === loc.longitude
    );
  });

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

  goToLocation(loc: GeoLocation): void {
    this.locationService.setActive(loc);
  }

  formatUpdated(date: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  toggleFavorite(): void {
    const loc = this.locationService.active();
    if (loc) this.locationService.toggleFavorite(loc);
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
        this.lastUpdated.set(new Date());
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
