const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';
const EMAIL = 'pravin1805@gmail.com';
const PASSWORD = 'Pravin@05';

// Helper: Login before each test
async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard/i);
}

test.describe('Dashboard Module', () => {

  // TC01 - Dashboard redirects to login if not logged in
  test('TC01 - Dashboard should redirect to login if not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(/login/i);
  });

  // TC02 - Dashboard loads after login
  test('TC02 - Dashboard should load after login', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/dashboard/i);
  });

  // TC03 - Sidebar brand name visible
  test('TC03 - Sidebar should show The Serene Path brand', async ({ page }) => {
    await login(page);
    await expect(page.locator('.sidebar-brand h2')).toHaveText('The Serene Path');
  });

  

  // TC04 - Stats cards are visible
  test('TC04 - Stats cards should be visible', async ({ page }) => {
    await login(page);
    await expect(page.locator('text=Total Check-ins')).toBeVisible();
    await expect(page.locator('text=Current Streak')).toBeVisible();
    await expect(page.locator("text=Today's Mood")).toBeVisible();
  });

 

  // TC05 - Clicking a mood logs it
  test('TC05 - Clicking a mood should update sanctuary state', async ({ page }) => {
    await login(page);
    const moodButtons = page.locator('.mini-mood-btn');
    if (await moodButtons.count() > 0) {
      await moodButtons.first().click();
      await expect(page.locator('.change-mood-btn')).toBeVisible();
    } else {
      // Already logged - just verify sanctuary state is shown
      await expect(page.locator('text=Sanctuary State:')).toBeVisible();
    }
  });

  
// TC06 - Clicking Journal card navigates to journal
  test('TC06 - Clicking Encrypted Journal card should navigate to journal', async ({ page }) => {
    await login(page);
    await page.locator('.action-card', { hasText: 'Encrypted Journal' }).click();
    await expect(page).toHaveURL(/journal/i);
  });

  // TC07 - Recent Journey panel visible
  test('TC07 - Recent Journey panel should be visible', async ({ page }) => {
    await login(page);
    await expect(page.locator('text=Recent Journey')).toBeVisible();
  });

  // TC08 - Go to Homepage button works
  test('TC08 - Go to Homepage button should navigate to homepage', async ({ page }) => {
    await login(page);
    await page.locator('text=Go to Homepage').click();
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });

  // TC09 - Logout works by clicking user profile
  test('TC09 - Clicking user profile should logout and redirect to login', async ({ page }) => {
    await login(page);
    await page.locator('.user-profile').click();
    await expect(page).toHaveURL(/login/i);
  });

  // TC10 - Intentional fail (wrong placeholder text)
test('TC10 - Search bar placeholder should say Search', async ({ page }) => {
  await login(page);
  await expect(page.locator('.search-bar input')).toHaveAttribute('placeholder', 'Search');
});

});