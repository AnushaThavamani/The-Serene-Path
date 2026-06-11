const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Feedback Module', () => {

  // TC01 - Page loads
  test('TC01 - Feedback page should have correct title', async ({ page }) => {
    await page.goto(`${BASE_URL}/feedback`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('The Serene Path');
  });

  // TC02 - Subject input visible
  test('TC02 - Subject input should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/feedback`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#subject')).toBeVisible({ timeout: 10000 });
  });

  // TC03 - Star rating visible
  test('TC03 - Star rating should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/feedback`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.feedback-star').first()).toBeVisible({ timeout: 10000 });
  });

  // TC04 - Submit without rating shows error
  test('TC04 - Submitting without rating should show error', async ({ page }) => {
    await page.goto(`${BASE_URL}/feedback`, { waitUntil: 'domcontentloaded' });
    await page.fill('#subject', 'Test');
    await page.fill('#message', 'Test message.');
    await page.locator('.feedback-submit-btn').click();
    await expect(page.locator('.feedback-status.error')).toBeVisible({ timeout: 10000 });
  });

});