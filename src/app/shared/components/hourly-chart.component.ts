import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { HourlyForecast } from '../../core/models/weather.model';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';
import { formatHour } from '../../core/utils/date.utils';
import { getTemperatureColor } from '../../core/utils/gradient.utils';

@Component({
  selector: 'app-hourly-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-wrap glass-card">
      <div class="chart-header">
        <h3 class="chart-title">48-Hour Temperature</h3>
      </div>
      <div class="chart-scroll">
        <svg [attr.viewBox]="'0 0 ' + svgWidth() + ' ' + svgHeight" preserveAspectRatio="none" class="chart-svg">
          <!-- Temperature area -->
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--accent-blue)" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="var(--accent-blue)" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path [attr.d]="areaPath()" fill="url(#tempGrad)" />
          <path [attr.d]="linePath()" fill="none" stroke="var(--accent-blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- Temperature points & labels -->
          @for (pt of points(); track pt.index; let i = $index) {
            @if (i % labelEvery() === 0) {
              <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="3.5" [attr.fill]="pt.color" stroke="var(--bg-deep)" stroke-width="1.5"/>
              <text [attr.x]="pt.x" [attr.y]="pt.y - 12" text-anchor="middle" fill="var(--text-primary)" font-size="11" font-weight="600">{{ pt.label }}</text>
              <text [attr.x]="pt.x" [attr.y]="svgHeight - 6" text-anchor="middle" fill="var(--text-tertiary)" font-size="10">{{ pt.time }}</text>
            }
          }

          <!-- Precip bars -->
          @for (pt of points(); track pt.index; let i = $index) {
            @if (pt.precipProb > 0 && i % labelEvery() === 0) {
              <rect [attr.x]="pt.x - 6" [attr.y]="svgHeight - 24 - pt.precipProb * 0.3" [attr.width]="12" [attr.height]="pt.precipProb * 0.3"
                    fill="var(--accent-blue)" opacity="0.25" rx="2"/>
            }
          }
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .chart-wrap { padding: var(--space-md) var(--space-md) var(--space-sm); }
    .chart-header { margin-bottom: var(--space-md); }
    .chart-title { font-size: 1rem; font-weight: 600; color: var(--text-secondary); margin: 0; }
    .chart-scroll { overflow-x: auto; scrollbar-width: thin; -webkit-overflow-scrolling: touch; }
    .chart-svg { display: block; min-width: 800px; width: 100%; height: 200px; }
  `],
})
export class HourlyChartComponent {
  readonly hours = input.required<HourlyForecast[]>();

  private readonly units = inject(UnitPreferencesService);

  readonly svgHeight = 200;
  readonly padding = { top: 30, bottom: 30, left: 20, right: 20 };

  readonly svgWidth = computed(() => Math.max(800, this.hours().length * 28));

  readonly labelEvery = computed(() => {
    const len = this.hours().length;
    if (len <= 24) return 2;
    return 3;
  });

  readonly points = computed(() => {
    const data = this.hours();
    if (!data.length) return [];
    const temps = data.map(h => h.temperature);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = max - min || 1;
    const w = this.svgWidth() - this.padding.left - this.padding.right;
    const h = this.svgHeight - this.padding.top - this.padding.bottom;
    const symbol = this.units.temperatureSymbol();
    return data.map((hour, i) => {
      const x = this.padding.left + (i / (data.length - 1)) * w;
      const y = this.padding.top + (1 - (hour.temperature - min) / range) * h;
      return {
        index: i,
        x,
        y,
        label: Math.round(hour.temperature) + '°',
        time: formatHour(hour.time),
        color: getTemperatureColor(hour.temperature, symbol),
        precipProb: hour.precipProbability,
      };
    });
  });

  linePath(): string {
    const pts = this.points();
    if (!pts.length) return '';
    return pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ');
  }

  areaPath(): string {
    const pts = this.points();
    if (!pts.length) return '';
    const bottom = this.svgHeight - this.padding.bottom;
    let d = 'M' + pts[0].x + ',' + bottom;
    pts.forEach(p => d += ' L' + p.x + ',' + p.y);
    d += ' L' + pts[pts.length - 1].x + ',' + bottom + ' Z';
    return d;
  }
}
