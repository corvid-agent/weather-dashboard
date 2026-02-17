import { Component, ChangeDetectionStrategy, inject, signal, output, OnInit, OnDestroy, ElementRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { GeocodingService } from '../../core/services/geocoding.service';
import { GeolocationService } from '../../core/services/geolocation.service';
import { LocationService } from '../../core/services/location.service';
import { GeocodingResult, GeoLocation } from '../../core/models/geocoding.model';

@Component({
  selector: 'app-location-search',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search-container" [class.open]="showResults()">
      <div class="search-input-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          #searchInput
          type="text"
          class="search-input"
          placeholder="Search city..."
          [ngModel]="query()"
          (ngModelChange)="onQueryChange($event)"
          (focus)="onFocus()"
          (keydown.escape)="close()"
          (keydown.arrowDown)="onArrowDown($event)"
          aria-label="Search for a city"
          role="combobox"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="search-results-list"
          [attr.aria-expanded]="showResults()"
          autocomplete="off"
        />
        @if (query()) {
          <button class="clear-btn" (click)="clear()" aria-label="Clear search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        }
      </div>

      @if (showResults()) {
        <div class="search-results" role="listbox" id="search-results-list" aria-label="Search results">
          <button class="result-item locate-btn" (click)="useMyLocation()" role="option">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent-gold)" stroke-width="2">
              <circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4m10-10h-4M6 12H2"/>
            </svg>
            <span class="result-text">
              <span class="result-name">Use my location</span>
              <span class="result-detail">Auto-detect</span>
            </span>
          </button>
          @if (loading()) {
            <div class="result-loading">Searching...</div>
          }
          @for (result of results(); track result.id) {
            <button class="result-item" (click)="selectResult(result)" role="option">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span class="result-text">
                <span class="result-name">{{ result.name }}</span>
                <span class="result-detail">{{ result.admin1 ? result.admin1 + ', ' : '' }}{{ result.country }}</span>
              </span>
            </button>
          }
          @if (locateError()) {
            <div class="result-error">{{ locateError() }}</div>
          }
          @if (!loading() && results().length === 0 && query().length >= 2) {
            <div class="result-empty">No cities found</div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
      max-width: 360px;
    }
    .search-input-wrap {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-full);
      padding: var(--space-sm) var(--space-md);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-container.open .search-input-wrap,
    .search-input-wrap:focus-within {
      border-color: var(--accent-gold);
      box-shadow: var(--shadow-glow);
    }
    .search-icon { color: var(--text-tertiary); flex-shrink: 0; }
    .search-input {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 0.95rem;
      font-family: var(--font-body);
      outline: none;
      min-width: 0;
    }
    .search-input::placeholder { color: var(--text-tertiary); }
    .clear-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-tertiary);
      padding: var(--space-sm);
      min-height: 44px;
      min-width: 44px;
    }
    .clear-btn:hover { color: var(--text-primary); }
    .search-results {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: var(--bg-raised);
      border: 1px solid var(--border-bright);
      border-radius: var(--radius-lg);
      overflow: hidden;
      z-index: 100;
      box-shadow: var(--shadow-lg);
      max-height: 360px;
      overflow-y: auto;
      backdrop-filter: blur(16px);
    }
    .result-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      width: 100%;
      padding: var(--space-md);
      text-align: left;
      color: var(--text-primary);
      transition: background 0.15s;
    }
    .result-item:hover { background: var(--bg-hover); }
    .result-item svg { flex-shrink: 0; color: var(--text-tertiary); }
    .locate-btn svg { color: var(--accent-gold); }
    .result-text { display: flex; flex-direction: column; min-width: 0; }
    .result-name { font-weight: 500; font-size: 0.95rem; }
    .result-detail { font-size: 0.8rem; color: var(--text-tertiary); }
    .result-error {
      padding: var(--space-md);
      text-align: center;
      color: var(--color-error);
      font-size: 0.85rem;
    }
    .result-loading, .result-empty {
      padding: var(--space-lg);
      text-align: center;
      color: var(--text-tertiary);
      font-size: 0.9rem;
    }
  `],
})
export class LocationSearchComponent implements OnInit, OnDestroy {
  private readonly geocoding = inject(GeocodingService);
  private readonly geolocation = inject(GeolocationService);
  private readonly locationService = inject(LocationService);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly locationSelected = output<GeoLocation>();

  readonly query = signal('');
  readonly results = signal<GeocodingResult[]>([]);
  readonly loading = signal(false);
  readonly showResults = signal(false);
  readonly locateError = signal('');

  private readonly search$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        if (q.length < 2) {
          this.results.set([]);
          this.loading.set(false);
          return [];
        }
        this.loading.set(true);
        return this.geocoding.search(q);
      }),
      takeUntil(this.destroy$),
    ).subscribe(results => {
      this.results.set(results);
      this.loading.set(false);
    });

    document.addEventListener('click', this.onDocClick);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.onDocClick);
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.search$.next(value);
    this.showResults.set(true);
  }

  onFocus(): void {
    this.showResults.set(true);
  }

  close(): void {
    this.showResults.set(false);
  }

  clear(): void {
    this.query.set('');
    this.results.set([]);
    this.searchInput()?.nativeElement.focus();
  }

  onArrowDown(event: Event): void {
    event.preventDefault();
    const firstBtn = (event.target as HTMLElement).closest('.search-container')?.querySelector('.result-item') as HTMLElement;
    firstBtn?.focus();
  }

  selectResult(result: GeocodingResult): void {
    const loc: GeoLocation = {
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1,
      timezone: result.timezone,
    };
    this.locationService.setActive(loc);
    this.locationSelected.emit(loc);
    this.query.set(result.name);
    this.close();
    this.searchInput()?.nativeElement.focus();
  }

  async useMyLocation(): Promise<void> {
    try {
      this.loading.set(true);
      this.locateError.set('');
      const pos = await this.geolocation.getCurrentPosition();
      this.geocoding.reverseGeocode(pos.latitude, pos.longitude).subscribe(loc => {
        this.locationService.setActive(loc);
        this.locationSelected.emit(loc);
        this.query.set(loc.name);
        this.loading.set(false);
        this.close();
      });
    } catch (err) {
      this.loading.set(false);
      this.locateError.set(err instanceof Error ? err.message : 'Location access denied');
    }
  }

  private onDocClick = (e: Event): void => {
    const el = (e.target as HTMLElement);
    if (!el.closest('app-location-search')) {
      this.showResults.set(false);
    }
  };
}
