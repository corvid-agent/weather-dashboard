import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ForecastResponse, HourlyForecast, DailyForecast } from '../models/weather.model';

const API_URL = 'https://api.open-meteo.com/v1/forecast';

const CURRENT_PARAMS = [
  'temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'is_day',
  'precipitation', 'rain', 'showers', 'snowfall', 'weather_code', 'cloud_cover',
  'pressure_msl', 'surface_pressure', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
  'dew_point_2m', 'visibility',
].join(',');

const HOURLY_PARAMS = [
  'temperature_2m', 'relative_humidity_2m', 'dew_point_2m', 'apparent_temperature',
  'precipitation_probability', 'precipitation', 'rain', 'showers', 'snowfall', 'snow_depth',
  'weather_code', 'pressure_msl', 'surface_pressure', 'cloud_cover', 'visibility',
  'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m', 'uv_index', 'is_day',
].join(',');

const DAILY_PARAMS = [
  'weather_code', 'temperature_2m_max', 'temperature_2m_min',
  'apparent_temperature_max', 'apparent_temperature_min',
  'sunrise', 'sunset', 'daylight_duration', 'sunshine_duration',
  'uv_index_max', 'precipitation_sum', 'rain_sum', 'showers_sum', 'snowfall_sum',
  'precipitation_hours', 'precipitation_probability_max',
  'wind_speed_10m_max', 'wind_gusts_10m_max', 'wind_direction_10m_dominant',
].join(',');

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  /**
   * Always fetches in base units (celsius, km/h, mm) so that:
   * - Thresholds in comfort/alert logic work correctly
   * - Client-side pipes handle conversion for display
   * - Unit changes are instant (no re-fetch needed)
   */
  loadForecast(lat: number, lon: number): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>(API_URL, {
      params: {
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: CURRENT_PARAMS,
        hourly: HOURLY_PARAMS,
        daily: DAILY_PARAMS,
        timezone: 'auto',
        forecast_days: '7',
        forecast_hours: '48',
        temperature_unit: 'celsius',
        wind_speed_unit: 'kmh',
        precipitation_unit: 'mm',
      },
    });
  }

  parseHourlyForecasts(res: ForecastResponse): HourlyForecast[] {
    const h = res.hourly;
    return h.time.map((t, i) => ({
      time: new Date(t),
      temperature: h.temperature_2m[i],
      feelsLike: h.apparent_temperature[i],
      humidity: h.relative_humidity_2m[i],
      dewPoint: h.dew_point_2m[i],
      precipProbability: h.precipitation_probability[i],
      precipitation: h.precipitation[i],
      snowfall: h.snowfall[i],
      weatherCode: h.weather_code[i],
      pressure: h.pressure_msl[i],
      cloudCover: h.cloud_cover[i],
      visibility: h.visibility[i],
      windSpeed: h.wind_speed_10m[i],
      windDirection: h.wind_direction_10m[i],
      windGusts: h.wind_gusts_10m[i],
      uvIndex: h.uv_index[i],
      isDay: h.is_day[i] === 1,
    }));
  }

  parseDailyForecasts(res: ForecastResponse): DailyForecast[] {
    const d = res.daily;
    return d.time.map((t, i) => ({
      date: new Date(t),
      weatherCode: d.weather_code[i],
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      feelsLikeMax: d.apparent_temperature_max[i],
      feelsLikeMin: d.apparent_temperature_min[i],
      sunrise: new Date(d.sunrise[i]),
      sunset: new Date(d.sunset[i]),
      daylightDuration: d.daylight_duration[i],
      sunshineDuration: d.sunshine_duration[i],
      uvIndexMax: d.uv_index_max[i],
      precipSum: d.precipitation_sum[i],
      rainSum: d.rain_sum[i],
      snowfallSum: d.snowfall_sum[i],
      precipHours: d.precipitation_hours[i],
      precipProbabilityMax: d.precipitation_probability_max[i],
      windSpeedMax: d.wind_speed_10m_max[i],
      windGustsMax: d.wind_gusts_10m_max[i],
      windDirectionDominant: d.wind_direction_10m_dominant[i],
    }));
  }
}
