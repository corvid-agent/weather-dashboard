import { Component, ChangeDetectionStrategy, inject, signal, effect, computed, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { LocationService } from '../../core/services/location.service';
import { AirQualityService } from '../../core/services/air-quality.service';
import { AirQualityResponse } from '../../core/models/air-quality.model';
import { AqiGaugeComponent } from '../../shared/components/aqi-gauge.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton.component';
import { ErrorCardComponent } from '../../shared/components/error-card.component';
import { getAqiCategory } from '../../core/utils/aqi.utils';

interface PollutantInfo {
  key: string;
  label: string;
  value: number;
  unit: string;
}

@Component({
  selector: 'app-air-quality',
  standalone: true,
  imports: [RouterLink, DecimalPipe, AqiGaugeComponent, LoadingSkeletonComponent, ErrorCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page container">
      <div class="page-header">
        <a routerLink="/" class="back-link">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
          Back
        </a>
        <div class="page-title-wrap">
          <h1 class="page-title">Air Quality</h1>
          @if (locationName()) {
            <span class="page-subtitle">{{ locationName() }}</span>
          }
        </div>
      </div>

      @if (loading()) {
        <app-loading-skeleton height="300px" />
        <app-loading-skeleton height="200px" />
      } @else if (error()) {
        <app-error-card title="Failed to load air quality" (retry)="reload()" />
      } @else if (data()) {
        <app-aqi-gauge [value]="data()!.current.us_aqi" />

        <div class="glass-card pollutants">
          <h3 class="section-title">Pollutant Breakdown</h3>
          <div class="pollutant-grid">
            @for (p of pollutants(); track p.key) {
              <div class="pollutant-item">
                <span class="poll-label">{{ p.label }}</span>
                <span class="poll-value">{{ p.value | number:'1.0-1' }}</span>
                <span class="poll-unit">{{ p.unit }}</span>
              </div>
            }
          </div>
        </div>

        <div class="glass-card eu-aqi">
          <div class="eu-row">
            <span class="eu-label">European AQI</span>
            <span class="eu-value">{{ data()!.current.european_aqi }}</span>
          </div>
          <div class="eu-row">
            <span class="eu-label">US AQI</span>
            <span class="eu-value">{{ data()!.current.us_aqi }}</span>
          </div>
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
    .pollutants { display: flex; flex-direction: column; gap: var(--space-md); }
    .pollutant-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-md); }
    .pollutant-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: var(--space-md);
      background: var(--bg-surface);
      border-radius: var(--radius);
    }
    .poll-label { font-size: 0.75rem; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }
    .poll-value { font-size: 1.5rem; font-weight: 700; }
    .poll-unit { font-size: 0.75rem; color: var(--text-tertiary); }
    .eu-aqi { display: flex; flex-direction: column; gap: var(--space-sm); }
    .eu-row { display: flex; justify-content: space-between; align-items: center; padding: var(--space-sm) 0; border-bottom: 1px solid var(--border); }
    .eu-row:last-child { border-bottom: none; }
    .eu-label { font-size: 0.9rem; color: var(--text-secondary); }
    .eu-value { font-size: 1.2rem; font-weight: 700; }
  `],
})
export class AirQualityComponent implements OnInit {
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);
  readonly locationName = computed(() => this.locationService.active()?.name ?? '');

  ngOnInit(): void {
    if (!this.locationService.active()) this.router.navigate(['/']);
  }
  private readonly aqService = inject(AirQualityService);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly data = signal<AirQualityResponse | null>(null);

  readonly pollutants = computed<PollutantInfo[]>(() => {
    const d = this.data();
    if (!d) return [];
    const c = d.current;
    return [
      { key: 'pm25', label: 'PM2.5', value: c.pm2_5, unit: 'μg/m³' },
      { key: 'pm10', label: 'PM10', value: c.pm10, unit: 'μg/m³' },
      { key: 'o3', label: 'Ozone (O₃)', value: c.ozone, unit: 'μg/m³' },
      { key: 'no2', label: 'NO₂', value: c.nitrogen_dioxide, unit: 'μg/m³' },
      { key: 'so2', label: 'SO₂', value: c.sulphur_dioxide, unit: 'μg/m³' },
      { key: 'co', label: 'CO', value: c.carbon_monoxide, unit: 'μg/m³' },
    ];
  });

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
    this.aqService.loadAirQuality(lat, lon).subscribe({
      next: res => { this.data.set(res); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
