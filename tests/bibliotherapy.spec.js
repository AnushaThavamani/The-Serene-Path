const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Bibliotherapy Module', () => {

  // TC01 - Page loads with correct title
  test('TC01 - Bibliotherapy page should have correct title', async ({ page }) => {
    await page.goto(`${BASE_URL}/bibliotherapy`);
    await expect(page).toHaveTitle('The Serene Path');
  });

  // TC02 - Search input is visible
  test('TC02 - Search input should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/bibliotherapy`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  // TC03 - Back button is visible
  test('TC03 - Back button should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/bibliotherapy`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.back-btn')).toBeVisible();
  });

  // TC04 - Library cards are visible
  test('TC04 - Library cards should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/bibliotherapy`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.library-card').first()).toBeVisible();
  });

});