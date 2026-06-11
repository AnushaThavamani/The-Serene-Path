const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Auth Module', () => {

  // TC01 - Register page loads
  test('TC01 - Register page should load', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await expect(page).toHaveTitle(/Serene/i);
  });

  // TC02 - Login page loads
  test('TC02 - Login page should load', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveTitle(/Serene/i);
  });

  
  // TC03 - Login with invalid credentials should stay on login page
test('TC03 - Login with invalid credentials should stay on login page', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', 'wrong@example.com');
  await page.fill('input[type="password"]', 'wrongpassword');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/login/i);
});

  // TC04 - Login with valid credentials
  test('TC04 - Login with valid credentials should redirect to dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'pravin1805@gmail.com');
    await page.fill('input[type="password"]', 'Pravin@05');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/i);
  });

  // TC05 - Register with existing email should stay on register page
  test('TC05 - Register with existing email should stay on register page', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[type="email"]', 'your@email.com');
    await page.fill('input[type="password"]', 'yourpassword');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/register/i);
  });

});