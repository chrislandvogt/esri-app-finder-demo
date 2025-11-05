import { test, expect } from '@playwright/test';

test('debug - check for errors and HTML structure', async ({ page }) => {
  const errors: string[] = [];
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  await page.goto('/');
  
  // Wait a bit for page to load
  await page.waitForTimeout(2000);
  
  // Log all errors
  console.log('=== ERRORS CAPTURED ===');
  errors.forEach(err => console.log(err));
  
  // Get HTML content
  const html = await page.content();
  console.log('=== PAGE HTML ===');
  console.log(html);
  
  // Check if React root exists
  const root = await page.locator('#root').count();
  console.log('=== ROOT ELEMENT COUNT ===', root);
  
  // Get root content
  if (root > 0) {
    const rootContent = await page.locator('#root').innerHTML();
    console.log('=== ROOT CONTENT ===');
    console.log(rootContent);
  }
  
  // This test always passes, it's just for debugging
  expect(true).toBe(true);
});
