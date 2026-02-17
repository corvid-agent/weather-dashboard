import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { DailyForecast } from '../../core/models/weather.model';
import { DailyCardComponent } from './daily-card.component';

@Component({
  selector: 'app-daily-row',
  standalone: true,
  imports: [DailyCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll-row">
      @for (day of days(); track day.date.getTime()) {
        <app-daily-card [day]="day" [weekMin]="weekMin()" [weekMax]="weekMax()" />
      }
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class DailyRowComponent {
  readonly days = input.required<DailyForecast[]>();

  readonly weekMin = computed(() => {
    const temps = this.days().map(d => d.tempMin);
    return temps.length ? Math.min(...temps) : 0;
  });

  readonly weekMax = computed(() => {
    const temps = this.days().map(d => d.tempMax);
    return temps.length ? Math.max(...temps) : 30;
  });
}
