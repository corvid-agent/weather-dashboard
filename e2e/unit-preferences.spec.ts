import { test, expect } from '@playwright/test';
import { mockAllApis, setLocationInStorage, setUnitsInStorage } from './helpers';

test.describe('Unit Preference Switching', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    await setLocationInStorage(page);
  });

  test('displays temperature in Celsius by default (metric locale)', async ({ page }) => {
    await setUnitsInStorage(page, { temperature: 'celsius' });
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Temperature values should contain the degree-C symbol
    const tempValue = page.locator('.temp-value');
    await expect(tempValue).toContainText('°C');
  });

  test('displays temperature in Fahrenheit when set', async ({ page }) => {
    await setUnitsInStorage(page, { temperature: 'fahrenheit' });
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Temperature values should contain the degree-F symbol
    const tempValue = page.locator('.temp-value');
    await expect(tempValue).toContainText('°F');
  });

  test('displays wind speed in km/h by default (metric)', async ({ page }) => {
    await setUnitsInStorage(page, { windSpeed: 'kmh' });
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Wind detail should contain km/h
    const windDetail = page.locator('.detail-item').filter({ hasText: 'Wind' }).first();
    await expect(windDetail.locator('.detail-value')).toContainText('km/h');
  });

  test('displays wind speed in mph when set', async ({ page }) => {
    await setUnitsInStorage(page, { windSpeed: 'mph' });
    await page.goto('/');
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    const windDetail = page.locator('.detail-item').filter({ hasText: 'Wind' }).first();
    await expect(windDetail.locator('.detail-value')).toContainText('mph');
  });

  test('switching temperature unit on settings page updates the preview', async ({ page }) => {
    await setUnitsInStorage(page, { temperature: 'celsius' });
    await page.goto('/settings');

    // The settings page should show temperature toggle buttons
    const celsiusBtn = page.locator('.toggle-btn:has-text("°C")');
    const fahrenheitBtn = page.locator('.toggle-btn:has-text("°F")');

    await expect(celsiusBtn).toHaveClass(/active/);
    await expect(fahrenheitBtn).not.toHaveClass(/active/);

    // Preview should show celsius value
    const tempPreview = page.locator('.setting-preview').first();
    await expect(tempPreview).toContainText('°C');

    // Switch to Fahrenheit
    await fahrenheitBtn.click();

    await expect(fahrenheitBtn).toHaveClass(/active/);
    await expect(celsiusBtn).not.toHaveClass(/active/);

    // Preview should update to Fahrenheit
    await expect(tempPreview).toContainText('°F');
  });

  test('switching wind speed unit on settings page updates the preview', async ({ page }) => {
    await setUnitsInStorage(page, { windSpeed: 'kmh' });
    await page.goto('/settings');

    const kmhBtn = page.locator('.toggle-btn:has-text("km/h")');
    const mphBtn = page.locator('.toggle-btn:has-text("mph")');

    await expect(kmhBtn).toHaveClass(/active/);

    // Switch to mph
    await mphBtn.click();
    await expect(mphBtn).toHaveClass(/active/);

    // Wind preview should show mph
    const windPreview = page.locator('.setting-row').filter({ hasText: 'Wind Speed' }).locator('.setting-preview');
    await expect(windPreview).toContainText('mph');
  });

  test('switching precipitation unit on settings page updates the preview', async ({ page }) => {
    await setUnitsInStorage(page, { precipitation: 'mm' });
    await page.goto('/settings');

    const mmBtn = page.locator('.toggle-btn:has-text("mm")');
    const inBtn = page.locator('.toggle-btn:has-text("in")');

    await expect(mmBtn).toHaveClass(/active/);

    // Preview should show mm
    const precipPreview = page.locator('.setting-row').filter({ hasText: 'Precipitation' }).locator('.setting-preview');
    await expect(precipPreview).toContainText('mm');

    // Switch to inches
    await inBtn.click();
    await expect(inBtn).toHaveClass(/active/);
    await expect(precipPreview).toContainText('in');
  });

  test('unit preferences persist after navigation', async ({ page }) => {
    await setUnitsInStorage(page, { temperature: 'celsius' });
    await page.goto('/settings');

    // Switch to Fahrenheit
    const fahrenheitBtn = page.locator('.toggle-btn:has-text("°F")');
    await fahrenheitBtn.click();
    await expect(fahrenheitBtn).toHaveClass(/active/);

    // Navigate to dashboard
    await page.locator('a[routerLink="/"]').first().click();
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });

    // Temperature should be in Fahrenheit
    const tempValue = page.locator('.temp-value');
    await expect(tempValue).toContainText('°F');
  });

  test('all wind speed unit options are available (km/h, mph, m/s, kn)', async ({ page }) => {
    await page.goto('/settings');

    await expect(page.locator('.toggle-btn:has-text("km/h")')).toBeVisible();
    await expect(page.locator('.toggle-btn:has-text("mph")')).toBeVisible();
    await expect(page.locator('.toggle-btn:has-text("m/s")')).toBeVisible();
    await expect(page.locator('.toggle-btn:has-text("kn")')).toBeVisible();
  });
});
