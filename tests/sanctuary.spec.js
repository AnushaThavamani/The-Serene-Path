const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Multimedia Sanctuary Module', () => {

  // TC01 - Page has correct title
  test('TC01 - Sanctuary page should have correct title', async ({ page }) => {
    await page.goto(`${BASE_URL}/sanctuary`);
    await expect(page).toHaveTitle('The Serene Path');
  });

  // TC02 - Hero badge visible
  test('TC02 - Hero section should show Multimedia Sanctuary badge', async ({ page }) => {
    await page.goto(`${BASE_URL}/sanctuary`);
    await page.waitForSelector('.san-root', { timeout: 20000 });
    await expect(page.locator('.san-hero-badge')).toBeVisible({ timeout: 20000 });
  });

  // TC03 - Genre pills visible
  test('TC03 - Genre filter pills should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/sanctuary`);
    await page.waitForSelector('.san-root', { timeout: 20000 });
    await expect(page.locator('.san-genre-pill').first()).toBeVisible({ timeout: 20000 });
  });

  // TC04 - Search input visible
  test('TC04 - Search input should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/sanctuary`);
    await page.waitForSelector('.san-search', { timeout: 20000 });
    await expect(page.locator('.san-search')).toBeVisible({ timeout: 20000 });
  });

  // TC05 - Media cards visible
  test('TC05 - Media cards should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/sanctuary`);
    await page.waitForSelector('.san-card', { timeout: 20000 });
    await expect(page.locator('.san-card').first()).toBeVisible({ timeout: 20000 });
  });

});