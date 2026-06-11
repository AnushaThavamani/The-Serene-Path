const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Homepage Module', () => {

  // TC01 - Homepage loads successfully
  test('TC01 - Homepage should load successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page).toHaveTitle(/Serene/i);
  });

  // TC02 - Brand name is visible
  test('TC02 - Brand name The Serene Path should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator('text=The Serene Path').first()).toBeVisible();
  });

  // TC03 - Navbar links are visible
  test('TC03 - Navbar links should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator('text=Journal').first()).toBeVisible();
    await expect(page.locator('text=Regulation').first()).toBeVisible();
    await expect(page.locator('text=Sanctuary').first()).toBeVisible();
    await expect(page.locator('text=Feedback').first()).toBeVisible();
  });

  // TC04 - Sign In button navigates to login
  test('TC04 - Sign In button should navigate to login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/login/i);
  });

  // TC05 - Get Started button navigates to register
  test('TC05 - Get Started button should navigate to register page', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.click('text=Get Started');
    await expect(page).toHaveURL(/register/i);
  });

  // TC06 - Begin Your Calm Routine button navigates to register
  test('TC06 - Begin Your Calm Routine button should navigate to register', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.click('text=Begin Your Calm Routine');
    await expect(page).toHaveURL(/register/i);
  });

  // TC07 - Return To Your Space button navigates to login
  test('TC07 - Return To Your Space button should navigate to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.click('text=Return To Your Space');
    await expect(page).toHaveURL(/login/i);
  });



  // TC08 - Clicking a mood shows saved message
  test('TC08 - Clicking a mood should show Mood saved successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.click('text=Happy');
    await expect(page.locator('text=Mood saved successfully.')).toBeVisible();
  });

  // TC09 - Module cards are visible
  test('TC09 - Module cards should be visible on homepage', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator('text=Quiet Journal')).toBeVisible();
    await expect(page.locator('text=Breathing Reset')).toBeVisible();
    await expect(page.locator('text=Healing Library')).toBeVisible();
    await expect(page.locator('text=Nature Sanctuary')).toBeVisible();
    await expect(page.locator('text=Support Feedback')).toBeVisible();
  });



  // TC10 - Footer is visible
  test('TC10 - Footer with copyright should be visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator('text=© 2026 The Serene Path')).toBeVisible();
  });

  // TC11 - Create My Space link navigates to register
  test('TC11 - Create My Space link should navigate to register', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.click('text=Create My Space');
    await expect(page).toHaveURL(/register/i);
  });

});