import { Component, ChangeDetectionStrategy, input, inject, computed } from '@angular/core';
import { WindSpeedPipe } from '../pipes/wind-speed.pipe';
import { UnitPreferencesService } from '../../core/services/unit-preferences.service';
import { degreesToCompass, getBeaufortScale } from '../../core/utils/wind.utils';

@Component({
  selector: 'app-wind-compass',
  standalone: true,
  imports: [WindSpeedPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card compass-card">
      <h3 class="card-label">Wind</h3>
      <div class="compass">
        <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
          <!-- Compass ring -->
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-bright)" stroke-width="1.5"/>
          <!-- Cardinal marks -->
          <text x="60" y="14" text-anchor="middle" fill="var(--text-tertiary)" font-size="11" font-weight="600">N</text>
          <text x="108" y="64" text-anchor="middle" fill="var(--text-tertiary)" font-size="11" font-weight="600">E</text>
          <text x="60" y="114" text-anchor="middle" fill="var(--text-tertiary)" font-size="11" font-weight="600">S</text>
          <text x="12" y="64" text-anchor="middle" fill="var(--text-tertiary)" font-size="11" font-weight="600">W</text>
          <!-- Needle -->
          <g [style.transform]="'rotate(' + direction() + 'deg)'" style="transform-origin: 60px 60px; transition: transform 0.6s ease">
            <polygon points="60,18 55,60 65,60" fill="var(--accent-red)" opacity="0.9"/>
            <polygon points="60,102 55,60 65,60" fill="var(--text-tertiary)" opacity="0.4"/>
          </g>
          <circle cx="60" cy="60" r="4" fill="var(--text-primary)"/>
        </svg>
      </div>
      <div class="wind-info">
        <span class="wind-speed">{{ speed() | windSpeed:units.windSpeedSymbol() }}</span>
        <span class="wind-dir">{{ compassDir() }}</span>
        @if (gusts() > speed()) {
          <span class="wind-gusts">Gusts {{ gusts() | windSpeed:units.windSpeedSymbol() }}</span>
        }
        <span class="wind-beaufort">{{ beaufort().description }}</span>
      </div>
    </div>
  `,
  styles: [`
    .compass-card {
      display: flex;
      flex-direction: column;
      align-items: center;
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
    .compass { position: relative; }
    .wind-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .wind-speed { font-size: 1.2rem; font-weight: 700; }
    .wind-dir { font-size: 0.9rem; color: var(--text-secondary); }
    .wind-gusts { font-size: 0.8rem; color: var(--accent-orange); }
    .wind-beaufort { font-size: 0.75rem; color: var(--text-tertiary); }
  `],
})
export class WindCompassComponent {
  readonly direction = input.required<number>();
  readonly speed = input.required<number>();
  readonly gusts = input(0);

  protected readonly units = inject(UnitPreferencesService);

  readonly compassDir = computed(() => degreesToCompass(this.direction()));
  readonly beaufort = computed(() => getBeaufortScale(this.speed()));
}
