import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HistoricalComparison, ComparisonType } from '../../core/services/historical.service';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';

@Component({
  selector: 'app-historical-comparison',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card history-card">
      <h3 class="card-label">vs. Historical Average</h3>
      <div class="comparison-list">
        @for (item of comparisons(); track item.metric) {
          <div class="comp-row">
            <span class="comp-metric">{{ item.metric }}</span>
            <div class="comp-values">
              <span class="comp-current">{{ convert(item.current, item.type) | number:'1.0-1' }} {{ unitLabel(item.type) }}</span>
              <span class="comp-diff" [class.positive]="item.diff > 0" [class.negative]="item.diff < 0">
                {{ item.diff > 0 ? '+' : '' }}{{ convert(item.diff, item.type) | number:'1.0-1' }}
              </span>
            </div>
            <span class="comp-avg">Avg: {{ convert(item.historical, item.type) | number:'1.0-1' }} {{ unitLabel(item.type) }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .history-card { display: flex; flex-direction: column; gap: var(--space-md); }
    .card-label {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin: 0;
    }
    .comparison-list { display: flex; flex-direction: column; gap: var(--space-sm); }
    .comp-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-sm) 0;
      border-bottom: 1px solid var(--border);
    }
    .comp-row:last-child { border-bottom: none; }
    .comp-metric { font-size: 0.9rem; font-weight: 500; flex: 1; }
    .comp-values { display: flex; align-items: center; gap: var(--space-sm); }
    .comp-current { font-weight: 600; font-size: 0.95rem; }
    .comp-diff {
      font-size: 0.875rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .comp-diff.positive { color: var(--accent-red); background: rgba(248, 113, 113, 0.1); }
    .comp-diff.negative { color: var(--accent-blue); background: rgba(96, 165, 250, 0.1); }
    .comp-avg { font-size: 0.875rem; color: var(--text-tertiary); }
  `],
})
export class HistoricalComparisonComponent {
  readonly comparisons = input.required<HistoricalComparison[]>();

  protected readonly units = inject(UnitPreferencesService);

  /** Convert base-unit value to display unit */
  convert(value: number, type: ComparisonType): number {
    switch (type) {
      case 'temperature':
        return this.units.temperatureUnit() === 'fahrenheit' ? value * 9 / 5 + 32 : value;
      case 'windSpeed': {
        const wu = this.units.windSpeedUnit();
        if (wu === 'mph') return value * 0.621371;
        if (wu === 'ms') return value / 3.6;
        if (wu === 'kn') return value * 0.539957;
        return value;
      }
      case 'precipitation':
        return this.units.precipitationUnit() === 'inch' ? value / 25.4 : value;
    }
  }

  unitLabel(type: ComparisonType): string {
    switch (type) {
      case 'temperature': return this.units.temperatureSymbol();
      case 'windSpeed': return this.units.windSpeedSymbol();
      case 'precipitation': return this.units.precipitationSymbol();
    }
  }
}
