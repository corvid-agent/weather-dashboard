import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnitPreferencesService } from './unit-preferences.service';

const API_URL = 'https://archive-api.open-meteo.com/v1/archive';

export interface HistoricalResponse {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
  daily_units: Record<string, string>;
}

export interface HistoricalComparison {
  metric: string;
  current: number;
  historical: number;
  unit: string;
  diff: number;
  diffPercent: number;
}

@Injectable({ providedIn: 'root' })
export class HistoricalService {
  private readonly http = inject(HttpClient);
  private readonly units = inject(UnitPreferencesService);

  loadHistorical(lat: number, lon: number): Observable<HistoricalResponse> {
    const now = new Date();
    const dates: string[] = [];
    for (let y = 1; y <= 5; y++) {
      const d = new Date(now.getFullYear() - y, now.getMonth(), now.getDate());
      dates.push(d.toISOString().slice(0, 10));
    }
    const startDate = dates[dates.length - 1];
    const endDate = dates[0];

    const unitParams = this.units.apiParams();
    return this.http.get<HistoricalResponse>(API_URL, {
      params: {
        latitude: lat.toString(),
        longitude: lon.toString(),
        start_date: startDate,
        end_date: endDate,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
        timezone: 'auto',
        ...unitParams,
      },
    });
  }
}
