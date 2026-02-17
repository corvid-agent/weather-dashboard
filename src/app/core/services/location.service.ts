import { Injectable, signal, computed } from '@angular/core';
import { GeoLocation } from '../models/geocoding.model';

const ACTIVE_KEY = 'weather-location';
const RECENTS_KEY = 'weather-recents';
const FAVORITES_KEY = 'weather-favorites';
const MAX_RECENTS = 8;

@Injectable({ providedIn: 'root' })
export class LocationService {
  readonly active = signal<GeoLocation | null>(this.loadActive());
  readonly recents = signal<GeoLocation[]>(this.loadList(RECENTS_KEY));
  readonly favorites = signal<GeoLocation[]>(this.loadList(FAVORITES_KEY));

  readonly hasLocation = computed(() => this.active() !== null);

  setActive(location: GeoLocation): void {
    this.active.set(location);
    this.addRecent(location);
    this.saveActive(location);
  }

  addRecent(location: GeoLocation): void {
    const list = this.recents().filter(
      r => !(r.latitude === location.latitude && r.longitude === location.longitude)
    );
    list.unshift(location);
    const trimmed = list.slice(0, MAX_RECENTS);
    this.recents.set(trimmed);
    this.saveList(RECENTS_KEY, trimmed);
  }

  toggleFavorite(location: GeoLocation): void {
    const list = this.favorites();
    const index = list.findIndex(
      f => f.latitude === location.latitude && f.longitude === location.longitude
    );
    if (index >= 0) {
      const next = [...list];
      next.splice(index, 1);
      this.favorites.set(next);
      this.saveList(FAVORITES_KEY, next);
    } else {
      const next = [...list, location];
      this.favorites.set(next);
      this.saveList(FAVORITES_KEY, next);
    }
  }

  isFavorite(location: GeoLocation): boolean {
    return this.favorites().some(
      f => f.latitude === location.latitude && f.longitude === location.longitude
    );
  }

  removeFavorite(location: GeoLocation): void {
    const next = this.favorites().filter(
      f => !(f.latitude === location.latitude && f.longitude === location.longitude)
    );
    this.favorites.set(next);
    this.saveList(FAVORITES_KEY, next);
  }

  clearRecents(): void {
    this.recents.set([]);
    this.saveList(RECENTS_KEY, []);
  }

  private loadActive(): GeoLocation | null {
    try {
      const raw = localStorage.getItem(ACTIVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  private saveActive(loc: GeoLocation): void {
    try { localStorage.setItem(ACTIVE_KEY, JSON.stringify(loc)); } catch { /* noop */ }
  }

  private loadList(key: string): GeoLocation[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private saveList(key: string, list: GeoLocation[]): void {
    try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* noop */ }
  }
}
