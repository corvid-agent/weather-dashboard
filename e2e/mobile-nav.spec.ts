import { test, expect } from '@playwright/test';
import { mockAllApis, setLocationInStorage } from './helpers';

test.describe('Mobile Bottom Navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    await setLocationInStorage(page);
  });

  test('bottom nav is visible at mobile width', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    const bottomNav = page.locator('.bottom-nav');
    await expect(bottomNav).toBeVisible();
  });

  test('desktop nav is hidden at mobile width', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    const desktopNav = page.locator('.desktop-nav');
    await expect(desktopNav).not.toBeVisible();
  });

  test('bottom nav contains all navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    const bottomNav = page.locator('.bottom-nav');

    await expect(bottomNav.locator('text=Home')).toBeVisible();
    await expect(bottomNav.locator('text=Hourly')).toBeVisible();
    await expect(bottomNav.locator('text=7-Day')).toBeVisible();
    await expect(bottomNav.locator('text=Air')).toBeVisible();
    await expect(bottomNav.locator('text=Settings')).toBeVisible();
  });

  test('bottom nav Home link is active on dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    const homeLink = page.locator('.bottom-nav a').filter({ hasText: 'Home' });
    await expect(homeLink).toHaveClass(/active/);
  });

  test('navigating to hourly via bottom nav works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    await page.locator('.bottom-nav a').filter({ hasText: 'Hourly' }).click();

    await expect(page).toHaveURL(/\/hourly/);
    await expect(page.locator('h1')).toContainText('48-Hour Forecast', { timeout: 10000 });

    // Hourly link should be active
    const hourlyLink = page.locator('.bottom-nav a').filter({ hasText: 'Hourly' });
    await expect(hourlyLink).toHaveClass(/active/);
  });

  test('navigating to 7-Day via bottom nav works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    await page.locator('.bottom-nav a').filter({ hasText: '7-Day' }).click();

    await expect(page).toHaveURL(/\/daily/);
    await expect(page.locator('h1')).toContainText('7-Day Forecast', { timeout: 10000 });
  });

  test('navigating to Air Quality via bottom nav works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    await page.locator('.bottom-nav a').filter({ hasText: 'Air' }).click();

    await expect(page).toHaveURL(/\/air-quality/);
    await expect(page.locator('h1')).toContainText('Air Quality', { timeout: 10000 });
  });

  test('navigating to Settings via bottom nav works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    await page.locator('.bottom-nav a').filter({ hasText: 'Settings' }).click();

    await expect(page).toHaveURL(/\/settings/);
    await expect(page.locator('h1')).toContainText('Settings', { timeout: 10000 });
  });

  test('logo text is hidden at mobile width', async ({ page }) => {
    await page.goto('/');

    const logoText = page.locator('.logo-text');
    await expect(logoText).not.toBeVisible();
  });

  test('search input is still accessible in mobile header', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // The header search should still be there even on mobile
    const headerSearch = page.locator('.app-header input[placeholder="Search city..."]');
    await expect(headerSearch).toBeVisible();
  });
});
