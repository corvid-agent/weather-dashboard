import { test, expect } from '@playwright/test';
import { mockAllApis, setLocationInStorage, blockGeolocation } from './helpers';

test.describe('App', () => {
  test('should load with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Weather Dashboard/);
  });

  test('should show welcome screen when no location set', async ({ page }) => {
    await blockGeolocation(page);
    await mockAllApis(page);
    await page.goto('/');
    await expect(page.locator('.welcome-title')).toBeVisible({ timeout: 10_000 });
  });

  test('should show header', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.app-header')).toBeVisible();
  });

  test('should show footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.app-footer')).toBeVisible();
  });

  test('should show dashboard when location is set', async ({ page }) => {
    await mockAllApis(page);
    await setLocationInStorage(page);
    await page.goto('/');
    await expect(page.locator('.location-bar')).toBeVisible({ timeout: 10_000 });
  });
});
