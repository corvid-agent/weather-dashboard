import { describe, test, expect } from 'bun:test';
import { ForecastResponse } from '../models/weather.model';

/**
 * Test the parsing logic from WeatherService.
 * Since parseHourlyForecasts and parseDailyForecasts are pure data transforms,
 * we extract the same logic here to test without Angular DI.
 */

function parseHourlyForecasts(res: ForecastResponse) {
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

function parseDailyForecasts(res: ForecastResponse) {
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

const mockForecast: ForecastResponse = {
  latitude: 40.71,
  longitude: -74.01,
  generationtime_ms: 0.5,
  utc_offset_seconds: -18000,
  timezone: 'America/New_York',
  timezone_abbreviation: 'EST',
  elevation: 10,
  current_units: {},
  current: {
    time: '2024-06-15T12:00',
    interval: 900,
    temperature_2m: 25,
    relative_humidity_2m: 60,
    apparent_temperature: 26,
    is_day: 1,
    precipitation: 0,
    rain: 0,
    showers: 0,
    snowfall: 0,
    weather_code: 0,
    cloud_cover: 10,
    pressure_msl: 1015,
    surface_pressure: 1013,
    wind_speed_10m: 12,
    wind_direction_10m: 180,
    wind_gusts_10m: 20,
    dew_point_2m: 16,
    visibility: 24140,
  },
  hourly_units: {},
  hourly: {
    time: ['2024-06-15T12:00', '2024-06-15T13:00', '2024-06-15T14:00'],
    temperature_2m: [25, 26, 27],
    relative_humidity_2m: [60, 58, 55],
    dew_point_2m: [16, 16, 15],
    apparent_temperature: [26, 27, 28],
    precipitation_probability: [10, 20, 30],
    precipitation: [0, 0, 0.5],
    rain: [0, 0, 0.5],
    showers: [0, 0, 0],
    snowfall: [0, 0, 0],
    snow_depth: [0, 0, 0],
    weather_code: [0, 1, 61],
    pressure_msl: [1015, 1015, 1014],
    surface_pressure: [1013, 1013, 1012],
    cloud_cover: [10, 20, 70],
    visibility: [24140, 24140, 15000],
    wind_speed_10m: [12, 14, 18],
    wind_direction_10m: [180, 190, 200],
    wind_gusts_10m: [20, 22, 28],
    uv_index: [6, 7, 4],
    is_day: [1, 1, 1],
  },
  daily_units: {},
  daily: {
    time: ['2024-06-15', '2024-06-16'],
    weather_code: [0, 61],
    temperature_2m_max: [28, 24],
    temperature_2m_min: [18, 16],
    apparent_temperature_max: [30, 25],
    apparent_temperature_min: [17, 15],
    sunrise: ['2024-06-15T05:25', '2024-06-16T05:25'],
    sunset: ['2024-06-15T20:31', '2024-06-16T20:31'],
    daylight_duration: [54360, 54360],
    sunshine_duration: [48000, 30000],
    uv_index_max: [8, 5],
    precipitation_sum: [0, 12],
    rain_sum: [0, 10],
    showers_sum: [0, 2],
    snowfall_sum: [0, 0],
    precipitation_hours: [0, 4],
    precipitation_probability_max: [10, 80],
    wind_speed_10m_max: [20, 30],
    wind_gusts_10m_max: [35, 50],
    wind_direction_10m_dominant: [180, 270],
  },
};

describe('parseHourlyForecasts', () => {
  test('returns correct number of entries', () => {
    const result = parseHourlyForecasts(mockForecast);
    expect(result.length).toBe(3);
  });

  test('parses time as Date', () => {
    const result = parseHourlyForecasts(mockForecast);
    expect(result[0].time).toBeInstanceOf(Date);
  });

  test('maps temperature correctly', () => {
    const result = parseHourlyForecasts(mockForecast);
    expect(result[0].temperature).toBe(25);
    expect(result[1].temperature).toBe(26);
    expect(result[2].temperature).toBe(27);
  });

  test('maps isDay as boolean', () => {
    const result = parseHourlyForecasts(mockForecast);
    expect(result[0].isDay).toBe(true);
  });

  test('maps weather code', () => {
    const result = parseHourlyForecasts(mockForecast);
    expect(result[0].weatherCode).toBe(0);
    expect(result[2].weatherCode).toBe(61);
  });

  test('maps precipitation probability', () => {
    const result = parseHourlyForecasts(mockForecast);
    expect(result[0].precipProbability).toBe(10);
    expect(result[2].precipProbability).toBe(30);
  });

  test('maps wind data', () => {
    const result = parseHourlyForecasts(mockForecast);
    expect(result[0].windSpeed).toBe(12);
    expect(result[0].windDirection).toBe(180);
    expect(result[0].windGusts).toBe(20);
  });
});

describe('parseDailyForecasts', () => {
  test('returns correct number of entries', () => {
    const result = parseDailyForecasts(mockForecast);
    expect(result.length).toBe(2);
  });

  test('parses date as Date', () => {
    const result = parseDailyForecasts(mockForecast);
    expect(result[0].date).toBeInstanceOf(Date);
  });

  test('maps temperature extremes', () => {
    const result = parseDailyForecasts(mockForecast);
    expect(result[0].tempMax).toBe(28);
    expect(result[0].tempMin).toBe(18);
  });

  test('maps sunrise/sunset as Date', () => {
    const result = parseDailyForecasts(mockForecast);
    expect(result[0].sunrise).toBeInstanceOf(Date);
    expect(result[0].sunset).toBeInstanceOf(Date);
  });

  test('maps precipitation data', () => {
    const result = parseDailyForecasts(mockForecast);
    expect(result[1].precipSum).toBe(12);
    expect(result[1].precipProbabilityMax).toBe(80);
  });

  test('maps UV index', () => {
    const result = parseDailyForecasts(mockForecast);
    expect(result[0].uvIndexMax).toBe(8);
  });

  test('maps wind data', () => {
    const result = parseDailyForecasts(mockForecast);
    expect(result[0].windSpeedMax).toBe(20);
    expect(result[0].windDirectionDominant).toBe(180);
  });
});
