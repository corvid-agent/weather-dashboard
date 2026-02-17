import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { HourlyForecast } from '../../core/models/weather.model';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';
import { formatHour } from '../../core/utils/date.utils';

@Component({
  selector: 'app-precipitation-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card chart-wrap">
      <h3 class="chart-title">Precipitation</h3>
      <div class="chart-scroll">
        <svg [attr.viewBox]="'0 0 ' + svgWidth() + ' 160'" class="chart-svg">
          @for (bar of bars(); track bar.index) {
            @if (bar.index % 3 === 0) {
              <!-- Probability bar -->
              <rect [attr.x]="bar.x" [attr.y]="130 - bar.probHeight" [attr.width]="barW" [attr.height]="bar.probHeight"
                    fill="var(--accent-blue)" opacity="0.2" rx="2"/>
              <!-- Amount bar -->
              <rect [attr.x]="bar.x" [attr.y]="130 - bar.amountHeight" [attr.width]="barW" [attr.height]="bar.amountHeight"
                    fill="var(--accent-blue)" opacity="0.7" rx="2"/>
              @if (bar.probHeight > 0) {
                <text [attr.x]="bar.x + barW / 2" [attr.y]="130 - bar.probHeight - 4" text-anchor="middle"
                      fill="var(--accent-blue)" font-size="9">{{ bar.prob }}%</text>
              }
              <text [attr.x]="bar.x + barW / 2" y="148" text-anchor="middle" fill="var(--text-tertiary)" font-size="9">{{ bar.time }}</text>
            }
          }
          @if (noData()) {
            <text x="50%" y="80" text-anchor="middle" fill="var(--text-tertiary)" font-size="13">No precipitation expected</text>
          }
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .chart-wrap { padding: var(--space-md); }
    .chart-title { font-size: 1rem; font-weight: 600; color: var(--text-secondary); margin: 0 0 var(--space-md); }
    .chart-scroll { overflow-x: auto; scrollbar-width: thin; }
    .chart-svg { display: block; min-width: 600px; width: 100%; height: 160px; }
  `],
})
export class PrecipitationChartComponent {
  readonly hours = input.required<HourlyForecast[]>();

  private readonly units = inject(UnitPreferencesService);

  readonly barW = 14;
  readonly svgWidth = computed(() => Math.max(600, this.hours().length * 20));

  readonly bars = computed(() => {
    const data = this.hours();
    const maxAmount = Math.max(1, ...data.map(h => h.precipitation));
    return data.map((h, i) => ({
      index: i,
      x: 20 + i * 18,
      prob: h.precipProbability,
      probHeight: h.precipProbability * 1,
      amountHeight: (h.precipitation / maxAmount) * 80,
      time: formatHour(h.time),
    }));
  });

  readonly noData = computed(() => this.hours().every(h => h.precipitation === 0 && h.precipProbability === 0));
}
