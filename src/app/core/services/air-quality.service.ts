import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AirQualityResponse } from '../models/air-quality.model';

const API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const CURRENT_PARAMS = [
  'european_aqi', 'us_aqi', 'pm10', 'pm2_5',
  'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone',
  'dust', 'uv_index', 'uv_index_clear_sky',
].join(',');

const HOURLY_PARAMS = [
  'pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone',
  'dust', 'uv_index', 'us_aqi', 'european_aqi',
  'us_aqi_pm2_5', 'us_aqi_pm10', 'us_aqi_nitrogen_dioxide',
  'us_aqi_ozone', 'us_aqi_sulphur_dioxide', 'us_aqi_carbon_monoxide',
].join(',');

@Injectable({ providedIn: 'root' })
export class AirQualityService {
  private readonly http = inject(HttpClient);

  loadAirQuality(lat: number, lon: number): Observable<AirQualityResponse> {
    return this.http.get<AirQualityResponse>(API_URL, {
      params: {
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: CURRENT_PARAMS,
        hourly: HOURLY_PARAMS,
        timezone: 'auto',
        forecast_hours: '24',
      },
    });
  }
}
