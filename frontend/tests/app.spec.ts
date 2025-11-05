import { test, expect } from '@playwright/test';

test.describe('ESRI App Finder & Builder Assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/ESRI App Finder & Builder Assistant/);
  });

  test('should display the header with hamburger menu', async ({ page }) => {
    // Check header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check header has correct background color (blue)
    await expect(header).toHaveCSS('background-color', /rgb\(37, 99, 235\)|#2563eb/i);
    
    // Check hamburger button exists
    const hamburgerButton = page.locator('header button[aria-label="Toggle sidebar"]');
    await expect(hamburgerButton).toBeVisible();
    
    // Check app title exists
    await expect(page.locator('header h1')).toContainText('ESRI App Finder & Builder Assistant');
    
    // Check version display
    await expect(page.locator('header').getByText('v1.0.0')).toBeVisible();
  });

  test('should display sidebar by default', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    
    // Check sidebar tabs exist
    await expect(page.getByRole('button', { name: /Chat/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Data/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Preview/i })).toBeVisible();
  });

  test('should toggle sidebar when hamburger is clicked', async ({ page }) => {
    const hamburgerButton = page.locator('header button[aria-label="Toggle sidebar"]');
    const sidebar = page.locator('aside');
    
    // Sidebar should be visible initially
    await expect(sidebar).toBeVisible();
    
    // Click hamburger to hide
    await hamburgerButton.click();
    await page.waitForTimeout(500); // Wait for animation
    
    // Check if sidebar has translate-x-full class (hidden)
    const sidebarClass = await sidebar.getAttribute('class');
    expect(sidebarClass).toContain('-translate-x-full');
    
    // Click again to show
    await hamburgerButton.click();
    await page.waitForTimeout(500);
    
    // Check if sidebar has translate-x-0 class (visible)
    const sidebarClassAfter = await sidebar.getAttribute('class');
    expect(sidebarClassAfter).toContain('translate-x-0');
  });

  test('should display Chat tab content by default', async ({ page }) => {
    // Chat tab should be active
    const chatTab = page.getByRole('button', { name: /Chat/i });
    await expect(chatTab).toHaveClass(/border-esri-blue-600/);
    
    // Check for chat interface elements
    await expect(page.getByPlaceholder('Describe what you want to build...')).toBeVisible();
    await expect(page.getByRole('button', { name: /Send/i })).toBeVisible();
    
    // Check for initial greeting message
    await expect(page.locator('text=/I\'m here to help you find/i')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Click Data tab
    await page.getByRole('button', { name: /Data/i }).click();
    
    // Check Living Atlas search is visible
    await expect(page.getByText(/Living Atlas Datasets/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Search datasets/i)).toBeVisible();
    
    // Click Preview tab
    await page.getByRole('button', { name: /Preview/i }).click();
    
    // Check preview content
    await expect(page.getByText(/No App Selected/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Chat/i })).toBeVisible();
  });

  test('should display map container', async ({ page }) => {
    const mapContainer = page.locator('.relative.w-full.h-full.bg-gray-200');
    await expect(mapContainer).toBeVisible();
    
    // Check for map controls
    await expect(page.locator('button[aria-label="Zoom in"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Zoom out"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Reset extent"]')).toBeVisible();
    
    // Check for basemap selector
    await expect(page.locator('select').first()).toBeVisible();
    
    // Check for placeholder content
    await expect(page.getByText(/Interactive Map/i)).toBeVisible();
  });

  test('should have responsive layout', async ({ page }) => {
    // Check that sidebar has fixed positioning
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveCSS('position', 'fixed');
    
    // Check that main content adjusts when sidebar is open
    const mainContent = page.locator('main');
    const marginLeft = await mainContent.evaluate((el) => 
      window.getComputedStyle(el).marginLeft
    );
    
    // When sidebar is open, margin should be 384px (w-96 = 24rem = 384px)
    expect(marginLeft).toBe('384px');
  });

  test('should handle chat input interaction', async ({ page }) => {
    const input = page.getByPlaceholder('Describe what you want to build...');
    const sendButton = page.getByRole('button', { name: /Send/i });
    
    // Type in the input
    await input.fill('I need to visualize crime data');
    await expect(input).toHaveValue('I need to visualize crime data');
    
    // Button should be enabled
    await expect(sendButton).toBeEnabled();
  });

  test('should display example prompt', async ({ page }) => {
    await expect(page.getByText(/Example:.*I need to visualize crime data/i)).toBeVisible();
  });

  test('should show layer list in map container', async ({ page }) => {
    await expect(page.getByText(/Layers/i)).toBeVisible();
    await expect(page.getByText(/No layers added yet/i)).toBeVisible();
  });

  test('should maintain state when switching tabs', async ({ page }) => {
    // Type something in chat
    const input = page.getByPlaceholder('Describe what you want to build...');
    await input.fill('Test message');
    
    // Switch to Data tab
    await page.getByRole('button', { name: /Data/i }).click();
    
    // Switch back to Chat tab
    await page.getByRole('button', { name: /Chat/i }).click();
    
    // Input should still have the value
    await expect(input).toHaveValue('Test message');
  });
});
