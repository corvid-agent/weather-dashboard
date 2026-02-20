import { test, expect } from '@playwright/test';
import { mockAllApis, setLocationInStorage } from './helpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    await setLocationInStorage(page);
  });

  test('navigates to hourly forecast page via "See All" button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Click the "See All" button next to "Hourly Forecast"
    const hourlySection = page.locator('section').filter({ hasText: 'Hourly Forecast' });
    await hourlySection.locator('button:has-text("See All")').click();

    await expect(page).toHaveURL(/\/hourly/);
    await expect(page.locator('h1')).toContainText('48-Hour Forecast');
  });

  test('navigates to daily forecast page via "See All" button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Click the "See All" button next to "7-Day Forecast"
    const dailySection = page.locator('section').filter({ hasText: '7-Day Forecast' });
    await dailySection.locator('button:has-text("See All")').click();

    await expect(page).toHaveURL(/\/daily/);
    await expect(page.locator('h1')).toContainText('7-Day Forecast');
  });

  test('navigates to air quality page from desktop nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Click the Air Quality link in the desktop nav
    await page.locator('.desktop-nav a[aria-label="Air Quality"]').click();

    await expect(page).toHaveURL(/\/air-quality/);
    await expect(page.locator('h1')).toContainText('Air Quality');
  });

  test('navigates to settings page from desktop nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    await page.locator('.desktop-nav a[aria-label="Settings"]').click();

    await expect(page).toHaveURL(/\/settings/);
    await expect(page.locator('h1')).toContainText('Settings');
  });

  test('navigates back to dashboard from hourly page via back link', async ({ page }) => {
    await page.goto('/hourly');

    // Wait for hourly page to load
    await expect(page.locator('h1')).toContainText('48-Hour Forecast', { timeout: 10000 });

    // Click the back link
    await page.locator('.back-link').click();

    await expect(page).toHaveURL('/');
  });

  test('navigates back to dashboard from daily page via back link', async ({ page }) => {
    await page.goto('/daily');

    await expect(page.locator('h1')).toContainText('7-Day Forecast', { timeout: 10000 });

    await page.locator('.back-link').click();

    await expect(page).toHaveURL('/');
  });

  test('navigates back to dashboard from air quality page via back link', async ({ page }) => {
    await page.goto('/air-quality');

    await expect(page.locator('h1')).toContainText('Air Quality', { timeout: 10000 });

    await page.locator('.back-link').click();

    await expect(page).toHaveURL('/');
  });

  test('navigates back to dashboard from settings page via back link', async ({ page }) => {
    await page.goto('/settings');

    await expect(page.locator('h1')).toContainText('Settings', { timeout: 10000 });

    await page.locator('.back-link').click();

    await expect(page).toHaveURL('/');
  });

  test('logo navigates to home', async ({ page }) => {
    await page.goto('/settings');

    await expect(page.locator('h1')).toContainText('Settings', { timeout: 10000 });

    await page.locator('.logo').click();

    await expect(page).toHaveURL('/');
  });

  test('desktop nav highlights the active route', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Home link should be active
    const homeLink = page.locator('.desktop-nav a[aria-label="Dashboard"]');
    await expect(homeLink).toHaveClass(/active/);

    // Navigate to settings
    await page.locator('.desktop-nav a[aria-label="Settings"]').click();
    await expect(page).toHaveURL(/\/settings/);

    const settingsLink = page.locator('.desktop-nav a[aria-label="Settings"]');
    await expect(settingsLink).toHaveClass(/active/);
    await expect(homeLink).not.toHaveClass(/active/);
  });

  test('unknown routes redirect to home', async ({ page }) => {
    await page.goto('/nonexistent-route');

    // Should redirect to the home page
    await expect(page).toHaveURL('/');
  });

  test('hourly forecast page shows data table when weather is loaded', async ({ page }) => {
    await page.goto('/hourly');

    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('48-Hour Forecast', { timeout: 10000 });

    // The table should have column headers
    await expect(page.locator('th:has-text("Time")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('th:has-text("Temp")')).toBeVisible();
    await expect(page.locator('th:has-text("Wind")')).toBeVisible();
  });

  test('daily forecast page shows day detail cards', async ({ page }) => {
    await page.goto('/daily');

    await expect(page.locator('h1')).toContainText('7-Day Forecast', { timeout: 10000 });

    // Each day should have a card with metrics
    const dayCards = page.locator('.day-detail');
    await expect(dayCards.first()).toBeVisible({ timeout: 10000 });

    // Should show at least 7 days
    await expect(dayCards).toHaveCount(7, { timeout: 10000 });
  });

  test('air quality page shows pollutant breakdown', async ({ page }) => {
    await page.goto('/air-quality');

    await expect(page.locator('h1')).toContainText('Air Quality', { timeout: 10000 });

    // Should show AQI gauge
    await expect(page.locator('app-aqi-gauge')).toBeVisible({ timeout: 10000 });

    // Pollutant section title
    await expect(page.locator('h3:has-text("Pollutant Breakdown")')).toBeVisible();

    // Individual pollutants
    await expect(page.locator('.poll-label:has-text("PM2.5")')).toBeVisible();
    await expect(page.locator('.poll-label:has-text("PM10")')).toBeVisible();
  });

  test('settings page shows all sections', async ({ page }) => {
    await page.goto('/settings');

    await expect(page.locator('h1')).toContainText('Settings', { timeout: 10000 });

    // Theme section
    await expect(page.locator('h3:has-text("Theme")')).toBeVisible();

    // Units section
    await expect(page.locator('h3:has-text("Units")')).toBeVisible();

    // Favorite Locations section
    await expect(page.locator('h3:has-text("Favorite Locations")')).toBeVisible();

    // Recent Locations section
    await expect(page.locator('h3:has-text("Recent Locations")')).toBeVisible();

    // About section
    await expect(page.locator('h3:has-text("About")')).toBeVisible();
    await expect(page.locator('text=Weather Dashboard v1.3.0')).toBeVisible();
  });
});
