import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { GeocodingResponse, GeocodingResult } from '../models/geocoding.model';

const API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly http = inject(HttpClient);

  search(query: string, count = 8): Observable<GeocodingResult[]> {
    if (!query || query.trim().length < 2) return of([]);
    return this.http.get<GeocodingResponse>(API_URL, {
      params: { name: query.trim(), count: count.toString(), language: 'en', format: 'json' },
    }).pipe(map(res => res.results ?? []));
  }

  reverseGeocode(lat: number, lon: number): Observable<GeocodingResult[]> {
    return this.search(lat.toFixed(2) + ',' + lon.toFixed(2), 1);
  }
}
