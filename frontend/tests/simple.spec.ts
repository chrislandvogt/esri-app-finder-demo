import { test, expect } from '@playwright/test';

test('verify application loads successfully', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Check that page loads
  await expect(page).toHaveTitle(/ESRI App Finder/);
  
  // Check for header
  const header = page.locator('header');
  await expect(header).toBeVisible({ timeout: 10000 });
  
  // Check for hamburger button
  await expect(page.locator('button[aria-label="Toggle sidebar"]')).toBeVisible();
  
  // Check for app title
  await expect(page.locator('h1')).toContainText('ESRI App Finder');
  
  console.log('✅ Application loaded successfully!');
  console.log('✅ Header with hamburger menu is visible!');
});
