import { Component, ChangeDetectionStrategy, inject, OnInit, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { LocationService } from './core/services/location.service';
import { LocationSearchComponent } from './shared/components/location-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LocationSearchComponent],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <div class="weather-bg"></div>

    <header class="app-header">
      <div class="header-inner">
        <a routerLink="/" class="logo" aria-label="Weather Dashboard Home">
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
            <circle cx="16" cy="14" r="6" fill="#fbbf24"/>
            <ellipse cx="18" cy="22" rx="10" ry="6" fill="#94a3b8" opacity="0.8"/>
            <ellipse cx="14" cy="20" rx="7" ry="5" fill="#cbd5e1" opacity="0.9"/>
          </svg>
          <span class="logo-text">Weather</span>
        </a>

        @if (hasLocation()) {
          <app-location-search />
        }

        <nav class="header-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" aria-label="Dashboard">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          </a>
          <a routerLink="/settings" routerLinkActive="active" aria-label="Settings">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </a>
          <button class="btn-icon theme-toggle" (click)="theme.toggle()" [attr.aria-label]="'Switch to ' + (theme.theme() === 'dark' ? 'light' : 'dark') + ' theme'">
            @if (theme.theme() === 'dark') {
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M4 12H2m15.07-5.07l-1.41 1.41M8.34 15.66l-1.41 1.41m0-12.73l1.41 1.41m8.73 8.73l1.41 1.41"/>
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            }
          </button>
        </nav>
      </div>
    </header>

    <main id="main-content">
      <router-outlet />
    </main>

    <footer class="app-footer">
      <p>Powered by <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></p>
    </footer>
  `,
  styles: [`
    .app-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border-bottom: 1px solid var(--glass-border);
      height: var(--header-height);
    }
    .header-inner {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 var(--space-lg);
      height: 100%;
      display: flex;
      align-items: center;
      gap: var(--space-lg);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .logo:hover { color: var(--accent-blue); }
    .logo-text { white-space: nowrap; }
    app-location-search { flex: 1; min-width: 0; }
    .header-nav {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      flex-shrink: 0;
    }
    .header-nav a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius);
      color: var(--text-secondary);
      transition: background 0.2s, color 0.2s;
    }
    .header-nav a:hover { background: var(--bg-hover); color: var(--text-primary); }
    .header-nav a.active { color: var(--accent-blue); background: var(--accent-blue-dim); }
    .theme-toggle { flex-shrink: 0; }
    main { min-height: calc(100vh - var(--header-height) - 60px); }
    .app-footer {
      text-align: center;
      padding: var(--space-lg);
      color: var(--text-tertiary);
      font-size: 0.8rem;
    }
    .app-footer a { color: var(--accent-blue); }
    @media (max-width: 640px) {
      .header-inner { padding: 0 var(--space-md); gap: var(--space-sm); }
      .logo-text { display: none; }
    }
  `],
})
export class App implements OnInit {
  protected readonly theme = inject(ThemeService);
  private readonly locationService = inject(LocationService);

  readonly hasLocation = computed(() => this.locationService.hasLocation());

  ngOnInit(): void {
    this.theme.init();
  }
}
