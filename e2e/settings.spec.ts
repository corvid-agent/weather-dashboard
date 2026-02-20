import { test, expect } from '@playwright/test';

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should show setting groups', async ({ page }) => {
    await expect(page.locator('.setting-group').first()).toBeVisible();
  });

  test('should show temperature unit toggles', async ({ page }) => {
    const toggles = page.locator('.toggle-btn');
    await expect(toggles.first()).toBeVisible();
  });

  test('should toggle temperature units', async ({ page }) => {
    const fahrenheit = page.locator('.toggle-btn', { hasText: '°F' });
    if (await fahrenheit.isVisible()) {
      await fahrenheit.click();
      await expect(fahrenheit).toHaveClass(/active/);
    }
  });

  test('should show about section', async ({ page }) => {
    await expect(page.locator('.about-section')).toBeVisible();
  });
});
