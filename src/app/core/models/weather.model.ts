export interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: CurrentWeather;
  hourly_units: Record<string, string>;
  hourly: HourlyData;
  daily_units: Record<string, string>;
  daily: DailyData;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  dew_point_2m: number;
  visibility: number;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  snow_depth: number[];
  weather_code: number[];
  pressure_msl: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  uv_index: number[];
  is_day: number[];
}

export interface DailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  daylight_duration: number[];
  sunshine_duration: number[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  dewPoint: number;
  precipProbability: number;
  precipitation: number;
  snowfall: number;
  weatherCode: number;
  pressure: number;
  cloudCover: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: Date;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  feelsLikeMax: number;
  feelsLikeMin: number;
  sunrise: Date;
  sunset: Date;
  daylightDuration: number;
  sunshineDuration: number;
  uvIndexMax: number;
  precipSum: number;
  rainSum: number;
  snowfallSum: number;
  precipHours: number;
  precipProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
}
