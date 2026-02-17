import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UnitPreferencesService, TemperatureUnit, WindSpeedUnit, PrecipitationUnit } from '../../core/services/unit-preferences.service';
import { ThemeService } from '../../core/services/theme.service';
import { LocationService } from '../../core/services/location.service';
import { GeoLocation } from '../../core/models/geocoding.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page container">
      <div class="page-header">
        <a routerLink="/" class="back-link">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
          Back
        </a>
        <h1 class="page-title">Settings</h1>
      </div>

      <div class="glass-card setting-group">
        <h3 class="group-title">Theme</h3>
        <div class="setting-row">
          <span class="setting-label">Appearance</span>
          <div class="toggle-group">
            <button class="toggle-btn" [class.active]="theme.theme() === 'dark'" (click)="theme.toggle()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
              Dark
            </button>
            <button class="toggle-btn" [class.active]="theme.theme() === 'light'" (click)="theme.toggle()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M4 12H2m15.07-5.07l-1.41 1.41M8.34 15.66l-1.41 1.41m0-12.73l1.41 1.41m8.73 8.73l1.41 1.41"/>
              </svg>
              Light
            </button>
          </div>
        </div>
      </div>

      <div class="glass-card setting-group">
        <h3 class="group-title">Units</h3>
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Temperature</span>
            <span class="setting-preview">{{ previewTemp() }}</span>
          </div>
          <div class="toggle-group">
            <button class="toggle-btn" [class.active]="units.temperatureUnit() === 'celsius'" (click)="units.setTemperature('celsius')">°C</button>
            <button class="toggle-btn" [class.active]="units.temperatureUnit() === 'fahrenheit'" (click)="units.setTemperature('fahrenheit')">°F</button>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Wind Speed</span>
            <span class="setting-preview">{{ previewWind() }}</span>
          </div>
          <div class="toggle-group">
            <button class="toggle-btn" [class.active]="units.windSpeedUnit() === 'kmh'" (click)="units.setWindSpeed('kmh')">km/h</button>
            <button class="toggle-btn" [class.active]="units.windSpeedUnit() === 'mph'" (click)="units.setWindSpeed('mph')">mph</button>
            <button class="toggle-btn" [class.active]="units.windSpeedUnit() === 'ms'" (click)="units.setWindSpeed('ms')">m/s</button>
            <button class="toggle-btn" [class.active]="units.windSpeedUnit() === 'kn'" (click)="units.setWindSpeed('kn')">kn</button>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Precipitation</span>
            <span class="setting-preview">{{ previewPrecip() }}</span>
          </div>
          <div class="toggle-group">
            <button class="toggle-btn" [class.active]="units.precipitationUnit() === 'mm'" (click)="units.setPrecipitation('mm')">mm</button>
            <button class="toggle-btn" [class.active]="units.precipitationUnit() === 'inch'" (click)="units.setPrecipitation('inch')">in</button>
          </div>
        </div>
      </div>

      <div class="glass-card setting-group">
        <h3 class="group-title">Favorite Locations</h3>
        @if (locationService.favorites().length === 0) {
          <p class="empty-text">No favorites yet. Star a location from the dashboard.</p>
        } @else {
          @for (fav of locationService.favorites(); track fav.latitude + ',' + fav.longitude) {
            <div class="fav-row">
              <div class="fav-info">
                <span class="fav-name">{{ fav.name }}</span>
                <span class="fav-detail">{{ fav.admin1 ? fav.admin1 + ', ' : '' }}{{ fav.country }}</span>
              </div>
              <button class="btn-icon remove-btn" (click)="locationService.removeFavorite(fav)" aria-label="Remove favorite">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          }
        }
      </div>

      <div class="glass-card setting-group">
        <h3 class="group-title">Recent Locations</h3>
        @if (locationService.recents().length === 0) {
          <p class="empty-text">No recent searches.</p>
        } @else {
          @for (r of locationService.recents(); track r.latitude + ',' + r.longitude) {
            <div class="fav-row">
              <div class="fav-info" (click)="selectLocation(r)">
                <span class="fav-name">{{ r.name }}</span>
                <span class="fav-detail">{{ r.admin1 ? r.admin1 + ', ' : '' }}{{ r.country }}</span>
              </div>
            </div>
          }
          <button class="btn-secondary clear-btn" (click)="locationService.clearRecents()">Clear Recents</button>
        }
      </div>

      <div class="glass-card about-section">
        <h3 class="group-title">About</h3>
        <p class="about-text">Weather Dashboard v1.3.0</p>
        <p class="about-text">Powered by <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a> — free weather API, no key required.</p>
        <p class="about-text">Built with Angular 21.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { padding-top: var(--space-xl); padding-bottom: var(--space-2xl); display: flex; flex-direction: column; gap: var(--space-lg); }
    .page-header { display: flex; align-items: center; gap: var(--space-md); }
    .back-link { display: flex; align-items: center; gap: var(--space-xs); color: var(--text-secondary); font-size: 0.9rem; }
    .back-link:hover { color: var(--accent-gold); }
    .page-title-wrap { display: flex; flex-direction: column; gap: 2px; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .setting-group { display: flex; flex-direction: column; gap: var(--space-md); }
    .group-title {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin: 0;
    }
    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-md);
    }
    .setting-info { display: flex; flex-direction: column; gap: 2px; }
    .setting-label { font-size: 0.95rem; font-weight: 500; }
    .setting-preview { font-size: 0.75rem; color: var(--text-tertiary); font-style: italic; }
    .toggle-group {
      display: flex;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .toggle-btn {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-md);
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: background 0.2s, color 0.2s;
      border-right: 1px solid var(--border);
    }
    .toggle-btn:last-child { border-right: none; }
    .toggle-btn.active {
      background: var(--accent-gold-dim);
      color: var(--accent-gold);
      font-weight: 600;
    }
    .toggle-btn:hover:not(.active) { background: var(--bg-hover); }
    .empty-text { color: var(--text-tertiary); font-size: 0.9rem; margin: 0; }
    .fav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-sm) 0;
      border-bottom: 1px solid var(--border);
    }
    .fav-row:last-of-type { border-bottom: none; }
    .fav-info { display: flex; flex-direction: column; cursor: pointer; }
    .fav-name { font-weight: 500; font-size: 0.95rem; }
    .fav-detail { font-size: 0.8rem; color: var(--text-tertiary); }
    .remove-btn { width: 32px; height: 32px; }
    .clear-btn { margin-top: var(--space-sm); align-self: flex-start; }
    .about-section { display: flex; flex-direction: column; gap: var(--space-sm); }
    .about-text { color: var(--text-secondary); font-size: 0.9rem; margin: 0; line-height: 1.5; }
    .about-text a { color: var(--accent-gold); }
  `],
})
export class SettingsComponent {
  protected readonly units = inject(UnitPreferencesService);
  protected readonly theme = inject(ThemeService);
  protected readonly locationService = inject(LocationService);

  /** Live preview: 22°C in user's selected unit */
  readonly previewTemp = computed(() => {
    const c = 22; // comfortable reference temp
    if (this.units.temperatureUnit() === 'fahrenheit') {
      return Math.round(c * 9 / 5 + 32) + '°F';
    }
    return c + '°C';
  });

  /** Live preview: 15 km/h in user's selected unit */
  readonly previewWind = computed(() => {
    const kmh = 15;
    const unit = this.units.windSpeedUnit();
    const map: Record<string, [number, string]> = {
      kmh: [kmh, 'km/h'],
      mph: [kmh * 0.621371, 'mph'],
      ms: [kmh / 3.6, 'm/s'],
      kn: [kmh * 0.539957, 'kn'],
    };
    const [val, label] = map[unit] ?? [kmh, 'km/h'];
    return Math.round(val) + ' ' + label;
  });

  /** Live preview: 5mm in user's selected unit */
  readonly previewPrecip = computed(() => {
    const mm = 5;
    if (this.units.precipitationUnit() === 'inch') {
      return (mm / 25.4).toFixed(2) + ' in';
    }
    return mm + ' mm';
  });

  selectLocation(loc: GeoLocation): void {
    this.locationService.setActive(loc);
  }
}
