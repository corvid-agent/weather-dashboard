export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code: string;
  country_code: string;
  admin1_id?: number;
  admin2_id?: number;
  admin3_id?: number;
  timezone: string;
  population?: number;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
}

export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
}
