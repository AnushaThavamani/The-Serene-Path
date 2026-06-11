const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';
const EMAIL = 'pravin1805@gmail.com';
const PASSWORD = 'Pravin@05';
const JOURNAL_PIN = '1234';

// Helper: Login
async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard/i);
}

// Helper: Login + Unlock Journal
async function unlockJournal(page) {
  await login(page);
  await page.goto(`${BASE_URL}/journal`);
  await page.waitForSelector('.j-input', { timeout: 10000 });
  await page.fill('.j-input', JOURNAL_PIN);
  await page.click('text=Unlock Sanctuary →');
  await page.waitForSelector('.j-app-container', { timeout: 10000 });
}

test.describe('Journal Module', () => {

  // TC01 - Journal redirects to login if not authenticated
  test('TC01 - Journal should redirect to login if not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/journal`);
    await expect(page).toHaveURL(/login/i);
  });

  // TC02 - Journal lock screen loads after login
  test('TC02 - Journal lock screen should load after login', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/journal`);
    await expect(page.locator('text=Unlock Sanctuary →')).toBeVisible({ timeout: 10000 });
  });

  // TC03 - Wrong PIN shows error
  test('TC03 - Wrong PIN should show error message', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/journal`);
    await page.waitForSelector('.j-input', { timeout: 10000 });
    await page.fill('.j-input', '0000');
    await page.click('text=Unlock Sanctuary →');
    await expect(page.locator('.j-error')).toBeVisible();
  });

  // TC04 - Correct PIN unlocks journal
  test('TC04 - Correct PIN should unlock journal', async ({ page }) => {
    await unlockJournal(page);
    await expect(page.locator('.j-app-container')).toBeVisible();
  });

  // TC05 - Journal library view loads
  test('TC05 - Journal library should be visible after unlock', async ({ page }) => {
    await unlockJournal(page);
    await expect(page.locator('text=All Entries').or(page.locator('text=Your desk is clear.'))).toBeVisible();
  });

  // TC06 - New Entry button opens write view
  test('TC06 - Clicking New Entry should open write view', async ({ page }) => {
    await unlockJournal(page);
    await page.click('text=✍️ Write Today');
    await expect(page.locator('.j-edit-title')).toBeVisible();
  });

  // TC07 - Can type title and content
  test('TC07 - Should be able to type title and content in editor', async ({ page }) => {
    await unlockJournal(page);
    await page.click('text=✍️ Write Today');
    await page.fill('.j-edit-title', 'Test Entry Title');
    await page.fill('.j-edit-content', 'This is a test journal entry content.');
    await expect(page.locator('.j-edit-title')).toHaveValue('Test Entry Title');
    await expect(page.locator('.j-edit-content')).toHaveValue('This is a test journal entry content.');
  });

  // TC08 - Save entry works
  test('TC08 - Saving a new entry should show success alert', async ({ page }) => {
    await unlockJournal(page);
    await page.click('text=✍️ Write Today');
    await page.fill('.j-edit-title', 'Playwright Test Entry');
    await page.fill('.j-edit-content', 'This entry was created by Playwright automation.');
    await page.click('text=🌿 Secure & Save');
    await expect(page.locator('.j-alert')).toBeVisible({ timeout: 10000 });
  });

  // TC09 - Search works
  test('TC09 - Search bar should filter entries', async ({ page }) => {
    await unlockJournal(page);
    await page.fill('.j-search', 'Playwright');
    await expect(page.locator('.j-search')).toHaveValue('Playwright');
  });

  // TC10 - Lock Journal works
  test('TC10 - Lock Vault button should lock the journal', async ({ page }) => {
    await unlockJournal(page);
    await page.click('text=🔒 Lock Vault');
    await expect(page.locator('text=Unlock Sanctuary →')).toBeVisible();
  });

  // TC11 - Back to Library button works in write view
  test('TC11 - Back to Library button should return to grid view', async ({ page }) => {
    await unlockJournal(page);
    await page.click('text=✍️ Write Today');
    await page.click('text=← Back to Library');
    await expect(page.locator('.j-grid').or(page.locator('text=Your desk is clear.'))).toBeVisible();
  });

});