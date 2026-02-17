import { Component, ChangeDetectionStrategy, inject, OnInit, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
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

    @if (navigating()) {
      <div class="nav-progress" aria-hidden="true"></div>
    }

    <header class="app-header">
      <div class="header-inner">
        <a routerLink="/" class="logo" aria-label="Weather Dashboard Home">
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
            <circle cx="16" cy="14" r="6" fill="#d4a843"/>
            <ellipse cx="18" cy="22" rx="10" ry="6" fill="#94a3b8" opacity="0.6"/>
            <ellipse cx="14" cy="20" rx="7" ry="5" fill="#cbd5e1" opacity="0.7"/>
          </svg>
          <span class="logo-text">Weather</span>
        </a>

        @if (hasLocation()) {
          <app-location-search />
        }

        <nav class="header-nav desktop-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" aria-label="Dashboard">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          </a>
          <a routerLink="/air-quality" routerLinkActive="active" aria-label="Air Quality">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2h8l4 10H4L8 2z"/><path d="M4 12h16v2a6 6 0 01-6 6h-4a6 6 0 01-6-6v-2z"/></svg>
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

    <!-- Mobile bottom nav -->
    <nav class="bottom-nav" aria-label="Mobile navigation">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        <span>Home</span>
      </a>
      <a routerLink="/hourly" routerLinkActive="active">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Hourly</span>
      </a>
      <a routerLink="/daily" routerLinkActive="active">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>7-Day</span>
      </a>
      <a routerLink="/air-quality" routerLinkActive="active">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-4a2 2 0 010-4h4"/><path d="M14 14H6a2 2 0 010-4h8"/><path d="M16 18h-6a2 2 0 010-4h6"/></svg>
        <span>Air</span>
      </a>
      <a routerLink="/settings" routerLinkActive="active">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
        <span>Settings</span>
      </a>
    </nav>
  `,
  styles: [`
    .nav-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      z-index: 100;
      background: var(--accent-gold);
      animation: progressSlide 1.5s ease-in-out infinite;
    }
    @keyframes progressSlide {
      0% { transform: scaleX(0); transform-origin: left; }
      50% { transform: scaleX(0.7); transform-origin: left; }
      100% { transform: scaleX(1); transform-origin: left; opacity: 0; }
    }
    .app-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--header-bg, rgba(13, 13, 13, 0.92));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
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
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .logo:hover { color: var(--accent-gold); }
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
    .header-nav a.active { color: var(--accent-gold); background: var(--accent-gold-dim); }
    .theme-toggle { flex-shrink: 0; }
    main {
      min-height: calc(100vh - var(--header-height) - 60px);
      padding-bottom: 0;
    }
    .app-footer {
      text-align: center;
      padding: var(--space-lg);
      color: var(--text-tertiary);
      font-size: 0.8rem;
    }
    .app-footer a { color: var(--accent-gold); }

    /* Mobile bottom nav */
    .bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 50;
      background: var(--header-bg, rgba(13, 13, 13, 0.95));
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 1px solid var(--border);
      padding: var(--space-xs) 0;
      padding-bottom: max(var(--space-xs), env(safe-area-inset-bottom));
    }
    .bottom-nav a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: var(--space-xs) 0;
      color: var(--text-tertiary);
      font-size: 0.65rem;
      font-weight: 500;
      letter-spacing: 0.02em;
      transition: color 0.2s;
    }
    .bottom-nav a.active {
      color: var(--accent-gold);
    }
    .bottom-nav a:hover { color: var(--text-primary); }

    @media (max-width: 640px) {
      .header-inner { padding: 0 var(--space-md); gap: var(--space-sm); }
      .logo-text { display: none; }
      .desktop-nav { display: none; }
      .bottom-nav {
        display: flex;
        justify-content: space-around;
      }
      main { padding-bottom: 72px; }
      .app-footer { padding-bottom: 80px; }
    }
  `],
})
export class App implements OnInit {
  protected readonly theme = inject(ThemeService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);

  readonly hasLocation = computed(() => this.locationService.hasLocation());
  readonly navigating = signal(false);

  ngOnInit(): void {
    this.theme.init();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.navigating.set(true);
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.navigating.set(false);
      }
    });
  }
}
