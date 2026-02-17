import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { getWeatherInfo } from '../../core/models/weather-codes';

@Component({
  selector: 'app-weather-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="weather-icon" [class]="'icon-' + info().icon" [style.font-size]="size() + 'px'" role="img" [attr.aria-label]="info().description">
      @switch (info().icon) {
        @case ('sun') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <circle cx="32" cy="32" r="14" fill="#fbbf24" class="sun-body"/>
            @for (i of rays; track i) {
              <line [attr.x1]="32 + 20 * cos(i * 30)" [attr.y1]="32 + 20 * sin(i * 30)"
                    [attr.x2]="32 + 26 * cos(i * 30)" [attr.y2]="32 + 26 * sin(i * 30)"
                    stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" class="sun-ray"/>
            }
          </svg>
        }
        @case ('moon') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <circle cx="32" cy="32" r="16" fill="#e2e8f0"/>
            <circle cx="40" cy="26" r="14" fill="#0f172a"/>
          </svg>
        }
        @case ('sun-cloud') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <circle cx="24" cy="22" r="10" fill="#fbbf24" class="sun-body"/>
            @for (i of shortRays; track i) {
              <line [attr.x1]="24 + 14 * cos(i * 45)" [attr.y1]="22 + 14 * sin(i * 45)"
                    [attr.x2]="24 + 18 * cos(i * 45)" [attr.y2]="22 + 18 * sin(i * 45)"
                    stroke="#fbbf24" stroke-width="2" stroke-linecap="round" class="sun-ray"/>
            }
            <ellipse cx="34" cy="40" rx="20" ry="12" fill="#94a3b8" opacity="0.9"/>
            <ellipse cx="26" cy="36" rx="12" ry="10" fill="#cbd5e1"/>
            <ellipse cx="40" cy="38" rx="10" ry="8" fill="#cbd5e1"/>
          </svg>
        }
        @case ('moon-cloud') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <circle cx="22" cy="20" r="10" fill="#e2e8f0"/>
            <circle cx="28" cy="16" r="9" fill="#0f172a"/>
            <ellipse cx="34" cy="40" rx="20" ry="12" fill="#94a3b8" opacity="0.9"/>
            <ellipse cx="26" cy="36" rx="12" ry="10" fill="#cbd5e1"/>
          </svg>
        }
        @case ('cloud-sun') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <circle cx="20" cy="20" r="8" fill="#fbbf24"/>
            <ellipse cx="34" cy="38" rx="22" ry="14" fill="#94a3b8" opacity="0.9" class="cloud-float"/>
            <ellipse cx="26" cy="34" rx="14" ry="12" fill="#cbd5e1" class="cloud-float"/>
            <ellipse cx="42" cy="36" rx="12" ry="10" fill="#cbd5e1" class="cloud-float"/>
          </svg>
        }
        @case ('cloud-moon') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <circle cx="20" cy="18" r="8" fill="#e2e8f0"/>
            <circle cx="25" cy="14" r="7" fill="#0f172a"/>
            <ellipse cx="34" cy="38" rx="22" ry="14" fill="#94a3b8" opacity="0.9"/>
            <ellipse cx="26" cy="34" rx="14" ry="12" fill="#cbd5e1"/>
          </svg>
        }
        @case ('clouds') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="36" rx="24" ry="14" fill="#94a3b8" class="cloud-float"/>
            <ellipse cx="22" cy="30" rx="16" ry="12" fill="#cbd5e1" class="cloud-float"/>
            <ellipse cx="42" cy="32" rx="14" ry="10" fill="#cbd5e1" class="cloud-float"/>
          </svg>
        }
        @case ('fog') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <line x1="10" y1="24" x2="54" y2="24" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
            <line x1="14" y1="32" x2="50" y2="32" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
            <line x1="10" y1="40" x2="54" y2="40" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
            <line x1="18" y1="48" x2="46" y2="48" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
          </svg>
        }
        @case ('drizzle') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="26" rx="22" ry="12" fill="#94a3b8"/>
            <ellipse cx="22" cy="22" rx="14" ry="10" fill="#cbd5e1"/>
            <ellipse cx="40" cy="24" rx="12" ry="8" fill="#cbd5e1"/>
            <line x1="22" y1="42" x2="20" y2="48" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
            <line x1="32" y1="44" x2="30" y2="50" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
            <line x1="42" y1="42" x2="40" y2="48" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
          </svg>
        }
        @case ('rain-light') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="24" rx="22" ry="12" fill="#94a3b8"/>
            <ellipse cx="22" cy="20" rx="14" ry="10" fill="#cbd5e1"/>
            <ellipse cx="40" cy="22" rx="12" ry="8" fill="#cbd5e1"/>
            <line x1="20" y1="40" x2="16" y2="50" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" class="rain-drop"/>
            <line x1="32" y1="42" x2="28" y2="52" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" class="rain-drop" style="animation-delay:0.3s"/>
            <line x1="44" y1="40" x2="40" y2="50" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" class="rain-drop" style="animation-delay:0.6s"/>
          </svg>
        }
        @case ('rain') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="22" rx="22" ry="12" fill="#64748b"/>
            <ellipse cx="22" cy="18" rx="14" ry="10" fill="#94a3b8"/>
            <ellipse cx="40" cy="20" rx="12" ry="8" fill="#94a3b8"/>
            <line x1="16" y1="38" x2="12" y2="50" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" class="rain-drop"/>
            <line x1="26" y1="40" x2="22" y2="52" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" class="rain-drop" style="animation-delay:0.2s"/>
            <line x1="36" y1="38" x2="32" y2="50" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" class="rain-drop" style="animation-delay:0.4s"/>
            <line x1="46" y1="40" x2="42" y2="52" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" class="rain-drop" style="animation-delay:0.6s"/>
          </svg>
        }
        @case ('rain-heavy') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="20" rx="22" ry="12" fill="#475569"/>
            <ellipse cx="22" cy="16" rx="14" ry="10" fill="#64748b"/>
            <ellipse cx="40" cy="18" rx="12" ry="8" fill="#64748b"/>
            <line x1="14" y1="36" x2="8" y2="52" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" class="rain-drop"/>
            <line x1="24" y1="38" x2="18" y2="54" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" class="rain-drop" style="animation-delay:0.15s"/>
            <line x1="34" y1="36" x2="28" y2="52" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" class="rain-drop" style="animation-delay:0.3s"/>
            <line x1="44" y1="38" x2="38" y2="54" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" class="rain-drop" style="animation-delay:0.45s"/>
            <line x1="54" y1="36" x2="48" y2="52" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" class="rain-drop" style="animation-delay:0.6s"/>
          </svg>
        }
        @case ('sleet') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="22" rx="22" ry="12" fill="#94a3b8"/>
            <ellipse cx="22" cy="18" rx="14" ry="10" fill="#cbd5e1"/>
            <line x1="20" y1="40" x2="16" y2="50" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
            <circle cx="34" cy="46" r="2.5" fill="#e2e8f0"/>
            <line x1="44" y1="40" x2="40" y2="50" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
            <circle cx="24" cy="52" r="2" fill="#e2e8f0"/>
          </svg>
        }
        @case ('snow-light') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="22" rx="22" ry="12" fill="#94a3b8"/>
            <ellipse cx="22" cy="18" rx="14" ry="10" fill="#cbd5e1"/>
            <ellipse cx="40" cy="20" rx="12" ry="8" fill="#cbd5e1"/>
            <circle cx="22" cy="44" r="2.5" fill="#e2e8f0" class="snow-fall"/>
            <circle cx="36" cy="48" r="2.5" fill="#e2e8f0" class="snow-fall" style="animation-delay:0.5s"/>
            <circle cx="44" cy="42" r="2" fill="#e2e8f0" class="snow-fall" style="animation-delay:1s"/>
          </svg>
        }
        @case ('snow') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="20" rx="22" ry="12" fill="#94a3b8"/>
            <ellipse cx="22" cy="16" rx="14" ry="10" fill="#cbd5e1"/>
            <ellipse cx="40" cy="18" rx="12" ry="8" fill="#cbd5e1"/>
            <circle cx="18" cy="40" r="3" fill="#e2e8f0" class="snow-fall"/>
            <circle cx="30" cy="44" r="3" fill="#e2e8f0" class="snow-fall" style="animation-delay:0.3s"/>
            <circle cx="42" cy="40" r="3" fill="#e2e8f0" class="snow-fall" style="animation-delay:0.6s"/>
            <circle cx="24" cy="52" r="2.5" fill="#e2e8f0" class="snow-fall" style="animation-delay:0.9s"/>
            <circle cx="38" cy="50" r="2.5" fill="#e2e8f0" class="snow-fall" style="animation-delay:0.4s"/>
          </svg>
        }
        @case ('snow-heavy') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="18" rx="22" ry="12" fill="#64748b"/>
            <ellipse cx="22" cy="14" rx="14" ry="10" fill="#94a3b8"/>
            <ellipse cx="40" cy="16" rx="12" ry="8" fill="#94a3b8"/>
            <circle cx="14" cy="38" r="3.5" fill="#e2e8f0" class="snow-fall"/>
            <circle cx="26" cy="42" r="3.5" fill="#e2e8f0" class="snow-fall" style="animation-delay:0.2s"/>
            <circle cx="38" cy="38" r="3.5" fill="#e2e8f0" class="snow-fall" style="animation-delay:0.4s"/>
            <circle cx="50" cy="42" r="3" fill="#e2e8f0" class="snow-fall" style="animation-delay:0.6s"/>
            <circle cx="20" cy="52" r="3" fill="#e2e8f0" class="snow-fall" style="animation-delay:0.8s"/>
            <circle cx="44" cy="50" r="3" fill="#e2e8f0" class="snow-fall" style="animation-delay:0.3s"/>
          </svg>
        }
        @case ('thunderstorm') {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="18" rx="22" ry="12" fill="#475569"/>
            <ellipse cx="22" cy="14" rx="14" ry="10" fill="#64748b"/>
            <ellipse cx="40" cy="16" rx="12" ry="8" fill="#64748b"/>
            <polygon points="30,32 22,46 30,46 26,58 40,42 32,42 36,32" fill="#fbbf24" class="lightning-flash"/>
            <line x1="16" y1="38" x2="12" y2="48" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" class="rain-drop"/>
            <line x1="48" y1="36" x2="44" y2="46" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" class="rain-drop" style="animation-delay:0.3s"/>
          </svg>
        }
        @default {
          <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()">
            <ellipse cx="32" cy="32" rx="22" ry="14" fill="#94a3b8"/>
            <ellipse cx="22" cy="28" rx="14" ry="12" fill="#cbd5e1"/>
            <ellipse cx="40" cy="30" rx="12" ry="10" fill="#cbd5e1"/>
          </svg>
        }
      }
    </div>
  `,
  styles: [`
    .weather-icon { display: inline-flex; align-items: center; justify-content: center; }
    .weather-icon svg { display: block; }
    .sun-body { filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.5)); }
    .sun-ray { transform-origin: center; animation: spin 20s linear infinite; }
    .cloud-float { animation: cloudFloat 4s ease-in-out infinite; }
    .rain-drop { animation: rainFall 1s linear infinite; }
    .snow-fall { animation: snowFall 2s ease-in-out infinite; }
    .lightning-flash { animation: flash 3s ease-in-out infinite; }
    @keyframes cloudFloat {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(2px); }
    }
    @keyframes rainFall {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0.3; transform: translateY(6px); }
    }
    @keyframes snowFall {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0.3; transform: translateY(8px); }
    }
    @keyframes flash {
      0%, 90%, 100% { opacity: 1; }
      95% { opacity: 0.2; }
    }
    @media (prefers-reduced-motion: reduce) {
      .sun-ray, .cloud-float, .rain-drop, .snow-fall, .lightning-flash {
        animation: none !important;
      }
    }
  `],
})
export class WeatherIconComponent {
  readonly code = input.required<number>();
  readonly isDay = input(true);
  readonly size = input(48);

  readonly info = computed(() => getWeatherInfo(this.code(), this.isDay()));
  readonly rays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  readonly shortRays = [0, 1, 2, 3, 4, 5, 6, 7];

  cos(deg: number): number { return Math.cos(deg * Math.PI / 180); }
  sin(deg: number): number { return Math.sin(deg * Math.PI / 180); }
}
