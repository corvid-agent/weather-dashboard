import { test, expect } from '@playwright/test';
import { mockAllApis, setLocationInStorage } from './helpers';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    await setLocationInStorage(page);
    await page.goto('/');
    await page.locator('.location-bar').waitFor({ state: 'visible', timeout: 10_000 });
  });

  test('should display current conditions', async ({ page }) => {
    await expect(page.locator('.hero-card')).toBeVisible();
    // Temperature is displayed in user's unit preference (may be C or F)
    await expect(page.locator('.hero-card')).toContainText(/\d+°/);
  });

  test('should display location name', async ({ page }) => {
    await expect(page.locator('.location-name')).toContainText('London');
  });

  test('should show highlight chips', async ({ page }) => {
    await expect(page.locator('.highlight-chip').first()).toBeVisible();
  });

  test('should show forecast sections', async ({ page }) => {
    await expect(page.locator('.section-title').first()).toBeVisible();
  });

  test('should have refresh button', async ({ page }) => {
    await expect(page.locator('.refresh-btn')).toBeVisible();
  });

  test('should have favorite button', async ({ page }) => {
    await expect(page.locator('.fav-btn')).toBeVisible();
  });
});
