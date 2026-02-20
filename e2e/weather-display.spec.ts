import { test, expect } from '@playwright/test';
import { mockAllApis, setLocationInStorage } from './helpers';

test.describe('Weather Data Loading and Display', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    await setLocationInStorage(page);
  });

  test('loads and displays current weather conditions', async ({ page }) => {
    await page.goto('/');

    // Wait for weather to load - location name should appear
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Current conditions card should be visible
    const heroCard = page.locator('.hero-card');
    await expect(heroCard).toBeVisible();

    // Temperature should be displayed (15.2 from mock, rendered as 15°C)
    await expect(heroCard.locator('.temp-value')).toBeVisible();

    // Weather description should appear
    await expect(heroCard.locator('.temp-desc')).toBeVisible();

    // Feels like should appear
    await expect(heroCard.locator('.temp-feels')).toContainText('Feels like');
  });

  test('displays current conditions detail items', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Detail labels to verify
    const expectedLabels = ['Humidity', 'Wind', 'Gusts', 'Pressure', 'Cloud Cover', 'Dew Point', 'Visibility'];
    for (const label of expectedLabels) {
      await expect(page.locator(`.detail-label:has-text("${label}")`).first()).toBeVisible();
    }
  });

  test('displays today highlights row with high, low, rain, and wind', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Highlights row
    const highlights = page.locator('.highlights-row');
    await expect(highlights).toBeVisible();

    await expect(highlights.locator('.hl-label:has-text("High")')).toBeVisible();
    await expect(highlights.locator('.hl-label:has-text("Low")')).toBeVisible();
    await expect(highlights.locator('.hl-label:has-text("Rain")')).toBeVisible();
    await expect(highlights.locator('.hl-label:has-text("Wind")')).toBeVisible();
  });

  test('displays hourly forecast section with "See All" button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    await expect(page.locator('h2:has-text("Hourly Forecast")')).toBeVisible();
    await expect(page.locator('button:has-text("See All")').first()).toBeVisible();
  });

  test('displays 7-day forecast section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    await expect(page.locator('h2:has-text("7-Day Forecast")')).toBeVisible();
  });

  test('displays weather grid cards (comfort, wind, humidity, UV, astronomy)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    const weatherGrid = page.locator('.weather-grid');
    await expect(weatherGrid).toBeVisible();

    // Wind compass should be present
    await expect(page.locator('app-wind-compass')).toBeVisible();
    // Comfort card
    await expect(page.locator('app-comfort-card')).toBeVisible();
    // Humidity card
    await expect(page.locator('app-humidity-card')).toBeVisible();
    // UV meter
    await expect(page.locator('app-uv-meter')).toBeVisible();
    // Astronomy
    await expect(page.locator('app-astronomy-card')).toBeVisible();
  });

  test('displays AQI gauge when air quality data is available', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // AQI gauge should be present
    await expect(page.locator('app-aqi-gauge').first()).toBeVisible();
  });

  test('displays location detail with region and country', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    const detail = page.locator('.location-detail');
    await expect(detail).toContainText('England');
    await expect(detail).toContainText('United Kingdom');
  });

  test('refresh button reloads weather data', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    const refreshBtn = page.locator('button[aria-label="Refresh weather data"]');
    await expect(refreshBtn).toBeVisible();

    // Click refresh
    await refreshBtn.click();

    // Data should still be loaded after refresh
    await expect(page.locator('.hero-card')).toBeVisible({ timeout: 10000 });
  });

  test('favorite toggle button works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Initially not a favorite
    const favBtn = page.locator('button[aria-label="Add to favorites"]');
    await expect(favBtn).toBeVisible();

    // Click to add favorite
    await favBtn.click();

    // Now the label should change to "Remove from favorites"
    await expect(page.locator('button[aria-label="Remove from favorites"]')).toBeVisible();

    // Click again to remove
    await page.locator('button[aria-label="Remove from favorites"]').click();
    await expect(page.locator('button[aria-label="Add to favorites"]')).toBeVisible();
  });

  test('shows loading skeleton before data arrives', async ({ page }) => {
    // Set up a delayed API response
    await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify((await import('./helpers')).createMockForecastResponse()),
      });
    });

    await page.route('**/air-quality-api.open-meteo.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify((await import('./helpers')).createMockAirQualityResponse()),
      });
    });

    await page.route('**/archive-api.open-meteo.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify((await import('./helpers')).createMockHistoricalResponse()),
      });
    });

    await setLocationInStorage(page);
    await page.goto('/');

    // Loading skeleton should be visible initially
    await expect(page.locator('app-loading-skeleton').first()).toBeVisible({ timeout: 3000 });
  });

  test('shows error card when API request fails', async ({ page }) => {
    // Override with a failing response
    await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    // Keep other mocks from helpers
    await page.route('**/air-quality-api.open-meteo.com/**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.route('**/archive-api.open-meteo.com/**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await setLocationInStorage(page);
    await page.goto('/');

    // Error card should appear
    await expect(page.locator('app-error-card')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Failed to load weather')).toBeVisible();
  });
});
