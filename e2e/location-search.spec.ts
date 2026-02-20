import { test, expect } from '@playwright/test';
import { mockAllApis, setLocationInStorage, MOCK_LOCATION } from './helpers';

test.describe('Location Search', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
  });

  test('shows welcome screen with search input when no location is stored', async ({ page }) => {
    await page.goto('/');
    // The welcome screen should show the title and a search prompt
    await expect(page.locator('h1')).toContainText('Weather Dashboard');
    await expect(page.locator('text=Search city...')).toBeVisible();
  });

  test('searches for a city and displays results', async ({ page }) => {
    await page.goto('/');

    // Type into the search input on the welcome screen
    const searchInput = page.locator('input[placeholder="Search city..."]').first();
    await searchInput.fill('London');

    // Wait for search results to appear (debounced)
    const resultsList = page.locator('#search-results-list');
    await expect(resultsList).toBeVisible({ timeout: 5000 });

    // Should show "Use my location" button and at least one London result
    await expect(page.locator('text=Use my location').first()).toBeVisible();
    await expect(page.locator('.result-name:has-text("London")').first()).toBeVisible();
  });

  test('selects a city from search results and loads weather data', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder="Search city..."]').first();
    await searchInput.fill('London');

    // Wait for results then click the first London result (not "Use my location")
    const londonResult = page.locator('.result-item:has(.result-name:has-text("London"))').first();
    await londonResult.waitFor({ state: 'visible', timeout: 5000 });

    // There should be the "Use my location" button first, then actual results.
    // Click the second .result-item which should be the first city result.
    const cityResults = page.locator('.result-item').filter({ hasText: 'United Kingdom' });
    await cityResults.first().click();

    // The dashboard should load and show the location name
    await expect(page.locator('.location-name')).toContainText('London', { timeout: 10000 });
  });

  test('shows "No cities found" for a query with no results', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder="Search city..."]').first();
    await searchInput.fill('notaplace');

    // Wait for the empty state message
    await expect(page.locator('text=No cities found')).toBeVisible({ timeout: 5000 });
  });

  test('clears search input when clear button is clicked', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder="Search city..."]').first();
    await searchInput.fill('London');

    // Wait for results, then click clear
    await expect(page.locator('#search-results-list')).toBeVisible({ timeout: 5000 });

    const clearBtn = page.locator('button[aria-label="Clear search"]').first();
    await clearBtn.click();

    // Input should be empty
    await expect(searchInput).toHaveValue('');
  });

  test('closes search results on Escape key', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder="Search city..."]').first();
    await searchInput.fill('London');

    await expect(page.locator('#search-results-list')).toBeVisible({ timeout: 5000 });

    // Press Escape
    await searchInput.press('Escape');

    // Results should be hidden
    await expect(page.locator('#search-results-list')).not.toBeVisible();
  });

  test('header search is visible when a location is already set', async ({ page }) => {
    await setLocationInStorage(page);
    await page.goto('/');

    // The header should contain a search input
    const headerSearch = page.locator('.app-header input[placeholder="Search city..."]');
    await expect(headerSearch).toBeVisible({ timeout: 10000 });
  });

  test('shows recent locations on the welcome page if recents exist', async ({ page }) => {
    // Set recents in storage but no active location
    await page.addInitScript(() => {
      localStorage.removeItem('weather-location');
      localStorage.setItem('weather-recents', JSON.stringify([{
        name: 'Paris',
        latitude: 48.8566,
        longitude: 2.3522,
        country: 'France',
        admin1: 'Ile-de-France',
        timezone: 'Europe/Paris',
      }]));
    });

    await page.goto('/');

    // Welcome screen should show recents
    await expect(page.locator('text=Recent')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.recent-chip:has-text("Paris")')).toBeVisible();
  });

  test('clicking a recent location chip loads that location', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('weather-location');
      localStorage.setItem('weather-recents', JSON.stringify([{
        name: 'Paris',
        latitude: 48.8566,
        longitude: 2.3522,
        country: 'France',
        admin1: 'Ile-de-France',
        timezone: 'Europe/Paris',
      }]));
    });

    await page.goto('/');

    const parisChip = page.locator('.recent-chip:has-text("Paris")');
    await parisChip.click();

    // Should start loading weather for Paris
    await expect(page.locator('.location-name')).toContainText('Paris', { timeout: 10000 });
  });
});
