import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { getUvCategory, getUvPercent } from '../../core/utils/uv.utils';

@Component({
  selector: 'app-uv-meter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card uv-card">
      <h3 class="card-label">UV Index</h3>
      <div class="uv-value" [style.color]="category().color">{{ index() }}</div>
      <div class="uv-bar">
        <div class="uv-segments">
          <div class="seg seg-low"></div>
          <div class="seg seg-mod"></div>
          <div class="seg seg-high"></div>
          <div class="seg seg-vhigh"></div>
          <div class="seg seg-extreme"></div>
        </div>
        <div class="uv-indicator" [style.left]="percent() + '%'"></div>
      </div>
      <span class="uv-level" [style.color]="category().color">{{ category().level }}</span>
      <p class="uv-rec">{{ category().recommendation }}</p>
    </div>
  `,
  styles: [`
    .uv-card {
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
    .uv-value { font-size: 2.5rem; font-weight: 800; line-height: 1; }
    .uv-bar {
      width: 100%;
      max-width: 200px;
      position: relative;
      margin: var(--space-sm) 0;
    }
    .uv-segments {
      display: flex;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
    }
    .seg { flex: 1; }
    .seg-low { background: var(--uv-low); }
    .seg-mod { background: var(--uv-moderate); }
    .seg-high { background: var(--uv-high); }
    .seg-vhigh { background: var(--uv-very-high); }
    .seg-extreme { background: var(--uv-extreme); }
    .uv-indicator {
      position: absolute;
      top: -3px;
      width: 14px;
      height: 14px;
      background: var(--text-primary);
      border-radius: 50%;
      border: 2px solid var(--bg-deep);
      transform: translateX(-50%);
      transition: left 0.3s ease;
    }
    .uv-level { font-size: 1rem; font-weight: 600; }
    .uv-rec {
      font-size: 0.8rem;
      color: var(--text-tertiary);
      text-align: center;
      margin: 0;
      line-height: 1.4;
    }
  `],
})
export class UvMeterComponent {
  readonly index = input.required<number>();

  readonly category = computed(() => getUvCategory(this.index()));
  readonly percent = computed(() => getUvPercent(this.index()));
}
