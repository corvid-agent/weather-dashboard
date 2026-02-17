import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { getAqiCategory } from '../../core/utils/aqi.utils';

@Component({
  selector: 'app-aqi-gauge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card aqi-card">
      <h3 class="card-label">Air Quality</h3>
      <div class="gauge-wrap">
        <svg viewBox="0 0 200 120" width="200" height="120">
          <!-- Background arc segments -->
          <path d="M20,100 A80,80 0 0,1 56,36" fill="none" stroke="var(--aqi-good)" stroke-width="10" stroke-linecap="round"/>
          <path d="M56,36 A80,80 0 0,1 100,20" fill="none" stroke="var(--aqi-moderate)" stroke-width="10" stroke-linecap="round"/>
          <path d="M100,20 A80,80 0 0,1 144,36" fill="none" stroke="var(--aqi-unhealthy-sensitive)" stroke-width="10" stroke-linecap="round"/>
          <path d="M144,36 A80,80 0 0,1 168,64" fill="none" stroke="var(--aqi-unhealthy)" stroke-width="10" stroke-linecap="round"/>
          <path d="M168,64 A80,80 0 0,1 180,100" fill="none" stroke="var(--aqi-very-unhealthy)" stroke-width="10" stroke-linecap="round"/>

          <!-- Needle -->
          <line x1="100" y1="100" [attr.x2]="needleX()" [attr.y2]="needleY()"
                stroke="var(--text-primary)" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="100" cy="100" r="5" fill="var(--text-primary)"/>

          <!-- Value text -->
          <text x="100" y="88" text-anchor="middle" [attr.fill]="category().color" font-size="28" font-weight="800">{{ value() }}</text>
        </svg>
      </div>
      <span class="aqi-level" [style.color]="category().color">{{ category().level }}</span>
      <p class="aqi-rec">{{ category().recommendation }}</p>
    </div>
  `,
  styles: [`
    .aqi-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-sm);
    }
    .card-label {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin: 0;
    }
    .gauge-wrap { margin: var(--space-sm) 0; }
    .aqi-level { font-size: 1.1rem; font-weight: 600; }
    .aqi-rec {
      font-size: 0.8rem;
      color: var(--text-tertiary);
      text-align: center;
      margin: 0;
      line-height: 1.4;
      max-width: 240px;
    }
  `],
})
export class AqiGaugeComponent {
  readonly value = input.required<number>();

  readonly category = computed(() => getAqiCategory(this.value()));

  needleX(): number {
    const angle = this.needleAngle();
    return 100 + 65 * Math.cos(angle);
  }

  needleY(): number {
    const angle = this.needleAngle();
    return 100 + 65 * Math.sin(angle);
  }

  private needleAngle(): number {
    const pct = Math.min(this.value() / 500, 1);
    const deg = 180 + pct * 180;
    return (deg * Math.PI) / 180;
  }
}
