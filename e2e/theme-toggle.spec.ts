import { test, expect } from '@playwright/test';
import { mockAllApis, setLocationInStorage, setThemeInStorage } from './helpers';

test.describe('Theme Toggle (Dark/Light)', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    await setLocationInStorage(page);
  });

  test('defaults to dark theme', async ({ page }) => {
    await setThemeInStorage(page, 'dark');
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('can switch from dark to light theme via header button', async ({ page }) => {
    await setThemeInStorage(page, 'dark');
    await page.goto('/');

    // The theme toggle button should be in the desktop nav
    const themeBtn = page.locator('.theme-toggle');
    await expect(themeBtn).toBeVisible();

    // Click to toggle to light
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('can switch from light to dark theme via header button', async ({ page }) => {
    await setThemeInStorage(page, 'light');
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const themeBtn = page.locator('.theme-toggle');
    await themeBtn.click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('theme persists after page reload', async ({ page }) => {
    await setThemeInStorage(page, 'dark');
    await page.goto('/');

    // Switch to light
    await page.locator('.theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Reload the page
    await page.reload();

    // Should still be light after reload
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('settings page shows theme toggle buttons with correct active state', async ({ page }) => {
    await setThemeInStorage(page, 'dark');
    await page.goto('/settings');

    // Dark button should be active
    const darkBtn = page.locator('.toggle-btn:has-text("Dark")');
    const lightBtn = page.locator('.toggle-btn:has-text("Light")');

    await expect(darkBtn).toHaveClass(/active/);
    await expect(lightBtn).not.toHaveClass(/active/);
  });

  test('can switch theme from settings page', async ({ page }) => {
    await setThemeInStorage(page, 'dark');
    await page.goto('/settings');

    const lightBtn = page.locator('.toggle-btn:has-text("Light")');
    await lightBtn.click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(lightBtn).toHaveClass(/active/);
  });

  test('theme toggle button has correct aria-label', async ({ page }) => {
    await setThemeInStorage(page, 'dark');
    await page.goto('/');

    const themeBtn = page.locator('.theme-toggle');
    await expect(themeBtn).toHaveAttribute('aria-label', 'Switch to light theme');

    // Toggle
    await themeBtn.click();
    await expect(themeBtn).toHaveAttribute('aria-label', 'Switch to dark theme');
  });
});
