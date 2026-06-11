const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'krishn0113@gmail.com';
const ADMIN_PASSWORD = 'Krishn@03';

async function loginAsAdmin(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForSelector('input[name="email"]');
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/admin/i, { timeout: 15000 });
}

test.describe('Admin Module', () => {

  // TC01 - Admin page loads
  test('TC01 - Admin page should have correct title', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveTitle('The Serene Path');
  });

  // TC02 - Tab bar visible
  test('TC02 - Admin tab bar should be visible', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.locator('.admin-tab').first()).toBeVisible({ timeout: 20000 });
  });

  // TC03 - Stat cards visible
  test('TC03 - Overview stat cards should be visible', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.locator('.admin-stat-card').first()).toBeVisible({ timeout: 20000 });
  });

  // TC04 - Feedback tab works
  test('TC04 - Clicking Feedback tab should show feedback section', async ({ page }) => {
    await loginAsAdmin(page);
    await page.locator('.admin-tab', { hasText: 'Feedback' }).click();
    await expect(page.locator('text=Recent Feedback')).toBeVisible({ timeout: 20000 });
  });

});