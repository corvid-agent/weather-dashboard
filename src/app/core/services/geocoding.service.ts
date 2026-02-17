import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import { GeocodingResponse, GeocodingResult, GeoLocation } from '../models/geocoding.model';

const SEARCH_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly http = inject(HttpClient);

  search(query: string, count = 8): Observable<GeocodingResult[]> {
    if (!query || query.trim().length < 2) return of([]);
    return this.http.get<GeocodingResponse>(SEARCH_URL, {
      params: { name: query.trim(), count: count.toString(), language: 'en', format: 'json' },
    }).pipe(map(res => res.results ?? []));
  }

  reverseGeocode(lat: number, lon: number): Observable<GeoLocation> {
    return this.http.get<{
      address?: { city?: string; town?: string; village?: string; county?: string; state?: string; country?: string };
      display_name?: string;
    }>(REVERSE_URL, {
      params: { lat: lat.toString(), lon: lon.toString(), format: 'json', zoom: '10' },
    }).pipe(
      map(res => {
        const addr = res.address;
        const name = addr?.city || addr?.town || addr?.village || addr?.county || 'Current Location';
        return {
          name,
          latitude: lat,
          longitude: lon,
          country: addr?.country ?? '',
          admin1: addr?.state,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }),
      catchError(() => of({
        name: 'Current Location',
        latitude: lat,
        longitude: lon,
        country: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })),
    );
  }
}
