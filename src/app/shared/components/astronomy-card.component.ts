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

      <!-- Sun arc visualization -->
      <div class="sun-arc-wrap">
        <svg class="sun-arc" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <!-- Arc path (semicircle) -->
          <path d="M 20 70 Q 100 -20 180 70" fill="none" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="4 3" />
          <!-- Horizon line -->
          <line x1="10" y1="70" x2="190" y2="70" stroke="var(--border)" stroke-width="1" />
          <!-- Filled arc up to sun position -->
          @if (sunProgress() > 0 && sunProgress() < 1) {
            <circle [attr.cx]="sunX()" [attr.cy]="sunY()" r="6" fill="var(--accent-gold)" />
            <circle [attr.cx]="sunX()" [attr.cy]="sunY()" r="10" fill="var(--accent-gold)" opacity="0.2" />
          }
          <!-- Sunrise label -->
          <text x="20" y="66" text-anchor="middle" fill="var(--text-tertiary)" font-size="7" font-weight="500">{{ sunriseTime() }}</text>
          <!-- Sunset label -->
          <text x="180" y="66" text-anchor="middle" fill="var(--text-tertiary)" font-size="7" font-weight="500">{{ sunsetTime() }}</text>
        </svg>
      </div>

      <div class="daylight-row">
        <div class="daylight">
          <span class="dl-label">Sunrise</span>
          <span class="dl-value">{{ sunriseTime() }}</span>
        </div>
        <div class="daylight">
          <span class="dl-label">Sunset</span>
          <span class="dl-value">{{ sunsetTime() }}</span>
        </div>
        <div class="daylight">
          <span class="dl-label">Daylight</span>
          <span class="dl-value">{{ daylightStr() }}</span>
        </div>
        <div class="daylight">
          <span class="dl-label">Sunshine</span>
          <span class="dl-value">{{ sunshineStr() }}</span>
        </div>
      </div>

      <div class="moon-section">
        <span class="moon-emoji" aria-hidden="true">{{ moonInfo().emoji }}</span>
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
    .sun-arc-wrap {
      width: 100%;
      max-width: 280px;
      margin: 0 auto;
    }
    .sun-arc { width: 100%; height: auto; }
    .daylight-row {
      display: flex;
      gap: var(--space-lg);
      padding: var(--space-sm) 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
    .daylight {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .dl-label { font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }
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
  readonly sunshineStr = computed(() => formatDuration(this.today().sunshineDuration));
  readonly moonInfo = computed(() => getMoonPhase(this.today().date));

  /** 0 = sunrise, 1 = sunset, <0 before sunrise, >1 after sunset */
  readonly sunProgress = computed(() => {
    const now = new Date();
    const rise = this.today().sunrise.getTime();
    const set = this.today().sunset.getTime();
    if (set === rise) return 0.5;
    return (now.getTime() - rise) / (set - rise);
  });

  /** X position on the arc SVG (20–180) */
  readonly sunX = computed(() => {
    const t = Math.max(0, Math.min(1, this.sunProgress()));
    return 20 + t * 160;
  });

  /** Y position on the arc SVG — follows a quadratic bezier Q 100 -20 */
  readonly sunY = computed(() => {
    const t = Math.max(0, Math.min(1, this.sunProgress()));
    // Quadratic bezier: P0=(20,70), P1=(100,-20), P2=(180,70)
    const y = (1 - t) * (1 - t) * 70 + 2 * (1 - t) * t * (-20) + t * t * 70;
    return y;
  });
}
