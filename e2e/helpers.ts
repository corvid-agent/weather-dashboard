import { Page, Route } from '@playwright/test';

/**
 * Mock location data used across E2E tests.
 * Uses London as a well-known reference city.
 */
export const MOCK_LOCATION = {
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
  country: 'United Kingdom',
  admin1: 'England',
  timezone: 'Europe/London',
};

/**
 * Geocoding API response when searching for "London".
 */
export const MOCK_GEOCODING_RESPONSE = {
  results: [
    {
      id: 2643743,
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      elevation: 11,
      feature_code: 'PPLC',
      country_code: 'GB',
      admin1_id: 6269131,
      timezone: 'Europe/London',
      population: 8982000,
      country: 'United Kingdom',
      admin1: 'England',
    },
    {
      id: 4517009,
      name: 'London',
      latitude: 39.8865,
      longitude: -83.4483,
      elevation: 312,
      feature_code: 'PPL',
      country_code: 'US',
      admin1_id: 5165418,
      timezone: 'America/New_York',
      population: 10060,
      country: 'United States',
      admin1: 'Ohio',
    },
  ],
  generationtime_ms: 1.5,
};

/**
 * Creates a minimal but complete weather forecast mock response.
 */
export function createMockForecastResponse() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const hourlyTimes: string[] = [];
  for (let i = 0; i < 48; i++) {
    const d = new Date(now);
    d.setHours(now.getHours() + i, 0, 0, 0);
    hourlyTimes.push(d.toISOString().slice(0, 16));
  }

  const dailyTimes: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dailyTimes.push(d.toISOString().slice(0, 10));
  }

  return {
    latitude: 51.5074,
    longitude: -0.1278,
    generationtime_ms: 0.5,
    utc_offset_seconds: 0,
    timezone: 'Europe/London',
    timezone_abbreviation: 'GMT',
    elevation: 11,
    current_units: { temperature_2m: '°C', wind_speed_10m: 'km/h' },
    current: {
      time: now.toISOString().slice(0, 16),
      interval: 900,
      temperature_2m: 15.2,
      relative_humidity_2m: 72,
      apparent_temperature: 13.8,
      is_day: 1,
      precipitation: 0,
      rain: 0,
      showers: 0,
      snowfall: 0,
      weather_code: 2,
      cloud_cover: 45,
      pressure_msl: 1013.2,
      surface_pressure: 1012.0,
      wind_speed_10m: 12.5,
      wind_direction_10m: 225,
      wind_gusts_10m: 22.3,
      dew_point_2m: 10.1,
      visibility: 15000,
    },
    hourly_units: { temperature_2m: '°C', wind_speed_10m: 'km/h' },
    hourly: {
      time: hourlyTimes,
      temperature_2m: hourlyTimes.map((_, i) => 12 + Math.sin(i / 4) * 5),
      relative_humidity_2m: hourlyTimes.map(() => 70 + Math.round(Math.random() * 10)),
      dew_point_2m: hourlyTimes.map(() => 9 + Math.round(Math.random() * 3)),
      apparent_temperature: hourlyTimes.map((_, i) => 10 + Math.sin(i / 4) * 5),
      precipitation_probability: hourlyTimes.map(() => Math.round(Math.random() * 40)),
      precipitation: hourlyTimes.map(() => 0),
      rain: hourlyTimes.map(() => 0),
      showers: hourlyTimes.map(() => 0),
      snowfall: hourlyTimes.map(() => 0),
      snow_depth: hourlyTimes.map(() => 0),
      weather_code: hourlyTimes.map(() => 2),
      pressure_msl: hourlyTimes.map(() => 1013),
      surface_pressure: hourlyTimes.map(() => 1012),
      cloud_cover: hourlyTimes.map(() => 45),
      visibility: hourlyTimes.map(() => 15000),
      wind_speed_10m: hourlyTimes.map(() => 12),
      wind_direction_10m: hourlyTimes.map(() => 225),
      wind_gusts_10m: hourlyTimes.map(() => 22),
      uv_index: hourlyTimes.map((_, i) => (i >= 6 && i <= 18) ? 3 + Math.random() * 3 : 0),
      is_day: hourlyTimes.map((_, i) => (i % 24 >= 6 && i % 24 <= 20) ? 1 : 0),
    },
    daily_units: { temperature_2m_max: '°C', wind_speed_10m_max: 'km/h' },
    daily: {
      time: dailyTimes,
      weather_code: dailyTimes.map(() => 2),
      temperature_2m_max: dailyTimes.map(() => 18),
      temperature_2m_min: dailyTimes.map(() => 9),
      apparent_temperature_max: dailyTimes.map(() => 16),
      apparent_temperature_min: dailyTimes.map(() => 7),
      sunrise: dailyTimes.map(d => d + 'T06:30'),
      sunset: dailyTimes.map(d => d + 'T19:45'),
      daylight_duration: dailyTimes.map(() => 47700),
      sunshine_duration: dailyTimes.map(() => 35000),
      uv_index_max: dailyTimes.map(() => 5.2),
      precipitation_sum: dailyTimes.map(() => 1.2),
      rain_sum: dailyTimes.map(() => 1.0),
      showers_sum: dailyTimes.map(() => 0.2),
      snowfall_sum: dailyTimes.map(() => 0),
      precipitation_hours: dailyTimes.map(() => 2),
      precipitation_probability_max: dailyTimes.map(() => 35),
      wind_speed_10m_max: dailyTimes.map(() => 25),
      wind_gusts_10m_max: dailyTimes.map(() => 40),
      wind_direction_10m_dominant: dailyTimes.map(() => 225),
    },
  };
}

/**
 * Creates a minimal air quality mock response.
 */
export function createMockAirQualityResponse() {
  const now = new Date();
  const hourlyTimes: string[] = [];
  for (let i = 0; i < 24; i++) {
    const d = new Date(now);
    d.setHours(i, 0, 0, 0);
    hourlyTimes.push(d.toISOString().slice(0, 16));
  }

  return {
    latitude: 51.5074,
    longitude: -0.1278,
    generationtime_ms: 0.3,
    utc_offset_seconds: 0,
    timezone: 'Europe/London',
    timezone_abbreviation: 'GMT',
    current_units: { us_aqi: '' },
    current: {
      time: now.toISOString().slice(0, 16),
      interval: 3600,
      european_aqi: 42,
      us_aqi: 55,
      pm10: 18.5,
      pm2_5: 12.3,
      carbon_monoxide: 220,
      nitrogen_dioxide: 15.8,
      sulphur_dioxide: 4.2,
      ozone: 85.1,
      dust: 5.0,
      uv_index: 3.5,
      uv_index_clear_sky: 4.0,
    },
    hourly_units: { us_aqi: '' },
    hourly: {
      time: hourlyTimes,
      pm10: hourlyTimes.map(() => 18),
      pm2_5: hourlyTimes.map(() => 12),
      carbon_monoxide: hourlyTimes.map(() => 220),
      nitrogen_dioxide: hourlyTimes.map(() => 15),
      sulphur_dioxide: hourlyTimes.map(() => 4),
      ozone: hourlyTimes.map(() => 85),
      dust: hourlyTimes.map(() => 5),
      uv_index: hourlyTimes.map(() => 3),
      us_aqi: hourlyTimes.map(() => 55),
      european_aqi: hourlyTimes.map(() => 42),
      us_aqi_pm2_5: hourlyTimes.map(() => 50),
      us_aqi_pm10: hourlyTimes.map(() => 45),
      us_aqi_nitrogen_dioxide: hourlyTimes.map(() => 20),
      us_aqi_ozone: hourlyTimes.map(() => 55),
      us_aqi_sulphur_dioxide: hourlyTimes.map(() => 10),
      us_aqi_carbon_monoxide: hourlyTimes.map(() => 5),
    },
  };
}

/**
 * Creates a mock historical data response.
 */
export function createMockHistoricalResponse() {
  const dailyTimes: string[] = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - 365 - i);
    dailyTimes.push(d.toISOString().slice(0, 10));
  }

  return {
    daily: {
      time: dailyTimes,
      temperature_2m_max: dailyTimes.map(() => 17),
      temperature_2m_min: dailyTimes.map(() => 8),
      precipitation_sum: dailyTimes.map(() => 1.5),
      wind_speed_10m_max: dailyTimes.map(() => 22),
    },
  };
}

/**
 * Set up route interception for all external APIs used by the app.
 * This ensures tests are deterministic and don't rely on real APIs.
 */
export async function mockAllApis(page: Page): Promise<void> {
  // Mock geocoding search API
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route: Route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams.get('name') || '';

    if (query.toLowerCase().includes('london')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_GEOCODING_RESPONSE),
      });
    } else if (query.toLowerCase().includes('notaplace')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ results: [], generationtime_ms: 0.5 }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [{
            id: 99999,
            name: query,
            latitude: 40.0,
            longitude: -74.0,
            elevation: 10,
            feature_code: 'PPL',
            country_code: 'US',
            timezone: 'America/New_York',
            population: 10000,
            country: 'United States',
            admin1: 'New Jersey',
          }],
          generationtime_ms: 0.5,
        }),
      });
    }
  });

  // Mock weather forecast API
  await page.route('**/api.open-meteo.com/v1/forecast**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(createMockForecastResponse()),
    });
  });

  // Mock air quality API
  await page.route('**/air-quality-api.open-meteo.com/v1/air-quality**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(createMockAirQualityResponse()),
    });
  });

  // Mock historical / archive API
  await page.route('**/archive-api.open-meteo.com/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(createMockHistoricalResponse()),
    });
  });

  // Mock Nominatim reverse geocode API
  await page.route('**/nominatim.openstreetmap.org/reverse**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        address: {
          city: 'London',
          state: 'England',
          country: 'United Kingdom',
        },
        display_name: 'London, England, United Kingdom',
      }),
    });
  });

  // Block IP geolocation to prevent auto-detection interfering with tests
  await page.route('**/ipapi.co/**', async (route: Route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
  });
}

/**
 * Block geolocation and IP-based location APIs so the app falls back to idle/welcome state.
 */
export async function blockGeolocation(page: Page): Promise<void> {
  // Block IP geolocation API
  await page.route('**/ipapi.co/**', route =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
  );

  // Override browser geolocation to deny permission
  await page.context().grantPermissions([], { origin: 'http://localhost:4280' });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (_success: any, error: any) => {
          if (error) error({ code: 1, message: 'User denied Geolocation' });
        },
        watchPosition: () => 0,
        clearWatch: () => {},
      },
    });
  });
}

/**
 * Set localStorage to simulate a location already being selected.
 * This is useful for tests that need to skip the welcome screen.
 */
export async function setLocationInStorage(page: Page): Promise<void> {
  await page.addInitScript((loc) => {
    localStorage.setItem('weather-location', JSON.stringify(loc));
    localStorage.setItem('weather-recents', JSON.stringify([loc]));
  }, MOCK_LOCATION);
}

/**
 * Set localStorage to simulate specific unit preferences.
 */
export async function setUnitsInStorage(page: Page, prefs: {
  temperature?: 'celsius' | 'fahrenheit';
  windSpeed?: 'kmh' | 'mph' | 'ms' | 'kn';
  precipitation?: 'mm' | 'inch';
}): Promise<void> {
  const defaults = { temperature: 'celsius', windSpeed: 'kmh', precipitation: 'mm' };
  await page.addInitScript((p) => {
    localStorage.setItem('weather-units', JSON.stringify(p));
  }, { ...defaults, ...prefs });
}

/**
 * Set localStorage theme preference.
 */
export async function setThemeInStorage(page: Page, theme: 'dark' | 'light'): Promise<void> {
  await page.addInitScript((t) => {
    localStorage.setItem('weather-theme', t);
  }, theme);
}
