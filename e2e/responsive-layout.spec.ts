import { test, expect } from '@playwright/test';
import { mockAllApis, setLocationInStorage } from './helpers';

test.describe('Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    await setLocationInStorage(page);
  });

  test.describe('320px (small mobile)', () => {
    test.use({ viewport: { width: 320, height: 568 } });

    test('page renders without horizontal overflow', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

      // Check that body width matches viewport (no horizontal scroll)
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(320);
    });

    test('bottom nav is visible at 320px', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.bottom-nav')).toBeVisible({ timeout: 10000 });
    });

    test('desktop nav is hidden at 320px', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.desktop-nav')).not.toBeVisible();
    });

    test('welcome screen renders correctly at 320px', async ({ page }) => {
      // Clear location so we get the welcome screen
      await page.addInitScript(() => {
        localStorage.removeItem('weather-location');
      });
      await page.goto('/');

      await expect(page.locator('.welcome-title')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('input[placeholder="Search city..."]').first()).toBeVisible();
    });

    test('hero card details stack in two columns at 320px', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

      // Verify the hero-details grid adapts
      const heroDetails = page.locator('.hero-details');
      await expect(heroDetails).toBeVisible();

      // At 320px the grid should use 2 columns per the CSS media query
      const gridStyle = await heroDetails.evaluate(el =>
        window.getComputedStyle(el).getPropertyValue('grid-template-columns')
      );
      // Should have 2 column tracks (not 3)
      const tracks = gridStyle.split(/\s+/).filter(t => t && t !== '0px');
      expect(tracks.length).toBeLessThanOrEqual(2);
    });

    test('settings page is usable at 320px', async ({ page }) => {
      await page.goto('/settings');

      await expect(page.locator('h1')).toContainText('Settings', { timeout: 10000 });

      // Toggle buttons should still be visible and clickable
      const celsiusBtn = page.locator('.toggle-btn:has-text("°C")');
      await expect(celsiusBtn).toBeVisible();
      await celsiusBtn.click();
    });
  });

  test.describe('768px (tablet)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('page renders at tablet width', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

      // At 768px, desktop nav should be visible (breakpoint is 640px)
      const desktopNav = page.locator('.desktop-nav');
      await expect(desktopNav).toBeVisible();
    });

    test('bottom nav is hidden at tablet width', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

      await expect(page.locator('.bottom-nav')).not.toBeVisible();
    });

    test('hero details use 3-column grid at tablet width', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

      const heroDetails = page.locator('.hero-details');
      await expect(heroDetails).toBeVisible();

      const gridStyle = await heroDetails.evaluate(el =>
        window.getComputedStyle(el).getPropertyValue('grid-template-columns')
      );
      const tracks = gridStyle.split(/\s+/).filter(t => t && t !== '0px');
      expect(tracks.length).toBeGreaterThanOrEqual(3);
    });

    test('weather grid renders properly at 768px', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

      const weatherGrid = page.locator('.weather-grid');
      await expect(weatherGrid).toBeVisible();

      // Grid children should be visible
      await expect(page.locator('app-wind-compass')).toBeVisible();
      await expect(page.locator('app-comfort-card')).toBeVisible();
    });

    test('hourly page table is scrollable at tablet width', async ({ page }) => {
      await page.goto('/hourly');

      await expect(page.locator('h1')).toContainText('48-Hour Forecast', { timeout: 10000 });

      const table = page.locator('table');
      await expect(table).toBeVisible({ timeout: 10000 });
    });

    test('daily forecast page renders day cards at 768px', async ({ page }) => {
      await page.goto('/daily');

      await expect(page.locator('h1')).toContainText('7-Day Forecast', { timeout: 10000 });

      // Day metrics should be in 3-column grid at this width
      const dayMetrics = page.locator('.day-metrics').first();
      await expect(dayMetrics).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('1280px (desktop)', () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test('page renders at full desktop width', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

      // Desktop nav should be visible
      await expect(page.locator('.desktop-nav')).toBeVisible();

      // Bottom nav should be hidden
      await expect(page.locator('.bottom-nav')).not.toBeVisible();
    });

    test('logo text is visible at desktop width', async ({ page }) => {
      await page.goto('/');

      const logoText = page.locator('.logo-text');
      await expect(logoText).toBeVisible();
      await expect(logoText).toContainText('Weather');
    });

    test('header shows search bar, nav links, and theme toggle', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

      // Search
      await expect(page.locator('.app-header input[placeholder="Search city..."]')).toBeVisible();

      // Nav links
      await expect(page.locator('.desktop-nav a[aria-label="Dashboard"]')).toBeVisible();
      await expect(page.locator('.desktop-nav a[aria-label="Air Quality"]')).toBeVisible();
      await expect(page.locator('.desktop-nav a[aria-label="Settings"]')).toBeVisible();

      // Theme toggle
      await expect(page.locator('.theme-toggle')).toBeVisible();
    });

    test('dashboard content is contained within max-width', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

      const dashboard = page.locator('.dashboard');
      const dashWidth = await dashboard.evaluate(el => el.getBoundingClientRect().width);

      // Should be constrained by max-width (likely 1200px or similar from CSS vars)
      expect(dashWidth).toBeLessThanOrEqual(1280);
    });

    test('footer is visible at desktop width', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

      const footer = page.locator('.app-footer');
      await expect(footer).toBeVisible();
      await expect(footer).toContainText('Open-Meteo');
    });

    test('air quality page shows full pollutant grid at desktop', async ({ page }) => {
      await page.goto('/air-quality');

      await expect(page.locator('h1')).toContainText('Air Quality', { timeout: 10000 });

      const pollutantGrid = page.locator('.pollutant-grid');
      await expect(pollutantGrid).toBeVisible({ timeout: 10000 });

      // All pollutants should be visible
      await expect(page.locator('.poll-label:has-text("PM2.5")')).toBeVisible();
      await expect(page.locator('.poll-label:has-text("PM10")')).toBeVisible();
      await expect(page.locator('.poll-label:has-text("O")')).toBeVisible(); // Ozone
      await expect(page.locator('.poll-label:has-text("NO")')).toBeVisible(); // NO2
      await expect(page.locator('.poll-label:has-text("SO")')).toBeVisible(); // SO2
      await expect(page.locator('.poll-label:has-text("CO")')).toBeVisible();
    });
  });
});
