export interface AirQualityResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  current_units: Record<string, string>;
  current: AirQualityCurrent;
  hourly_units: Record<string, string>;
  hourly: AirQualityHourly;
}

export interface AirQualityCurrent {
  time: string;
  interval: number;
  european_aqi: number;
  us_aqi: number;
  pm10: number;
  pm2_5: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
  ozone: number;
  dust: number;
  uv_index: number;
  uv_index_clear_sky: number;
}

export interface AirQualityHourly {
  time: string[];
  pm10: number[];
  pm2_5: number[];
  carbon_monoxide: number[];
  nitrogen_dioxide: number[];
  sulphur_dioxide: number[];
  ozone: number[];
  dust: number[];
  uv_index: number[];
  us_aqi: number[];
  european_aqi: number[];
  us_aqi_pm2_5: number[];
  us_aqi_pm10: number[];
  us_aqi_nitrogen_dioxide: number[];
  us_aqi_ozone: number[];
  us_aqi_sulphur_dioxide: number[];
  us_aqi_carbon_monoxide: number[];
}

export interface AqiBreakdown {
  pollutant: string;
  label: string;
  value: number;
  unit: string;
  aqi: number;
}
