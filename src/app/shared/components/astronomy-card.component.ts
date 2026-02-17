import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { DailyForecast } from '../../core/models/weather.model';
import { formatTime, formatDuration } from '../../core/utils/date.utils';
import { getMoonPhase } from '../../core/utils/moon-phase.utils';

@Component({
  selector: 'app-astronomy-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card astro-card">
      <h3 class="card-label">Sun & Moon</h3>

      <div class="sun-times">
        <div class="sun-item">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent-yellow)" stroke-width="2">
            <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-5.07l-1.41 1.41M8.34 15.66l-1.41 1.41m0-12.73l1.41 1.41m8.73 8.73l1.41 1.41"/>
            <circle cx="12" cy="12" r="5"/>
          </svg>
          <div class="sun-detail">
            <span class="sun-label">Sunrise</span>
            <span class="sun-value">{{ sunriseTime() }}</span>
          </div>
        </div>
        <div class="sun-item">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent-orange)" stroke-width="2">
            <path d="M12 10v2m0 16v2m10-10h-2M4 12H2m15.07-5.07l-1.41 1.41M8.34 15.66l-1.41 1.41m0-12.73l1.41 1.41m8.73 8.73l1.41 1.41"/>
            <circle cx="12" cy="12" r="5"/>
            <line x1="2" y1="20" x2="22" y2="20"/>
          </svg>
          <div class="sun-detail">
            <span class="sun-label">Sunset</span>
            <span class="sun-value">{{ sunsetTime() }}</span>
          </div>
        </div>
      </div>

      <div class="daylight">
        <span class="dl-label">Daylight</span>
        <span class="dl-value">{{ daylightStr() }}</span>
      </div>

      <div class="moon-section">
        <span class="moon-emoji">{{ moonInfo().emoji }}</span>
        <div class="moon-detail">
          <span class="moon-phase">{{ moonInfo().phase }}</span>
          <span class="moon-illum">{{ moonInfo().illumination }}% illuminated</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .astro-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .card-label {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin: 0;
    }
    .sun-times {
      display: flex;
      gap: var(--space-lg);
    }
    .sun-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
    .sun-detail { display: flex; flex-direction: column; }
    .sun-label { font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }
    .sun-value { font-size: 1rem; font-weight: 600; }
    .daylight {
      display: flex;
      justify-content: space-between;
      padding: var(--space-sm) 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
    .dl-label { font-size: 0.85rem; color: var(--text-tertiary); }
    .dl-value { font-size: 0.95rem; font-weight: 600; }
    .moon-section {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }
    .moon-emoji { font-size: 2rem; }
    .moon-detail { display: flex; flex-direction: column; }
    .moon-phase { font-size: 0.95rem; font-weight: 600; }
    .moon-illum { font-size: 0.8rem; color: var(--text-tertiary); }
  `],
})
export class AstronomyCardComponent {
  readonly today = input.required<DailyForecast>();

  readonly sunriseTime = computed(() => formatTime(this.today().sunrise));
  readonly sunsetTime = computed(() => formatTime(this.today().sunset));
  readonly daylightStr = computed(() => formatDuration(this.today().daylightDuration));
  readonly moonInfo = computed(() => getMoonPhase(this.today().date));
}
