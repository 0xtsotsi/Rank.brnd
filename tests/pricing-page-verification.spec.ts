/**
 * Temporary Pricing Page Verification Test
 *
 * This test verifies the pricing page is accessible and displays correctly.
 * After successful verification, this file should be deleted.
 */

import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the pricing page
    await page.goto('/dashboard/pricing');
  });

  test('should display pricing page with all plans', async ({ page }) => {
    // Check that the page title is visible
    await expect(page.locator('h1').filter({ hasText: 'Choose Your Plan' })).toBeVisible();

    // Check that all 4 pricing cards are visible
    await expect(page.locator('text=Free')).toBeVisible();
    await expect(page.locator('text=Starter')).toBeVisible();
    await expect(page.locator('text=Pro')).toBeVisible();
    await expect(page.locator('text=Agency')).toBeVisible();

    // Check for the billing toggle
    await expect(page.locator('text=Monthly')).toBeVisible();
    await expect(page.locator('text=Yearly')).toBeVisible();

    // Check for FAQ section
    await expect(page.locator('text=Frequently Asked Questions')).toBeVisible();

    // Check for comparison table
    await expect(page.locator('text=Compare All Plans')).toBeVisible();
    await expect(page.locator('text=Feature Comparison')).toBeVisible();
  });

  test('should toggle between monthly and yearly billing', async ({ page }) => {
    // Find the billing toggle button
    const toggle = page.locator('button[aria-pressed="false"]').first();

    // Click to toggle to yearly
    await toggle.click();

    // Check that savings message appears
    await expect(page.locator('text=Save 20%')).toBeVisible();

    // Toggle back to monthly
    await page.locator('button[aria-pressed="true"]').first().click();

    // Verify toggle worked
    await expect(page.locator('button[aria-pressed="false"]').first()).toBeVisible();
  });

  test('should display feature comparison table', async ({ page }) => {
    // Scroll to comparison table
    await page.locator('text=Compare All Plans').scrollIntoViewIfNeeded();

    // Check for key features in the table
    await expect(page.locator('text=AI Content Generation')).toBeVisible();
    await expect(page.locator('text=Keyword Research')).toBeVisible();
    await expect(page.locator('text=API Access')).toBeVisible();

    // Check for usage limits comparison
    await expect(page.locator('text=Usage Limits Comparison')).toBeVisible();
    await expect(page.locator('text=Articles per Month')).toBeVisible();
    await expect(page.locator('text=Team Members')).toBeVisible();
  });

  test('should display pricing cards with correct information', async ({ page }) => {
    // Check Free plan
    const freeCard = page.locator('.card').filter({ hasText: 'Free' }).first();
    await expect(freeCard).toBeVisible();
    await expect(freeCard.locator('text=$0')).toBeVisible();

    // Check Starter plan (should have "Most Popular" badge)
    const starterCard = page.locator('.card').filter({ hasText: 'Starter' });
    await expect(starterCard).toBeVisible();

    // Check Pro plan (should have "Best Value" badge)
    const proCard = page.locator('.card').filter({ hasText: 'Pro' });
    await expect(proCard).toBeVisible();

    // Check Agency plan (should show unlimited)
    const agencyCard = page.locator('.card').filter({ hasText: 'Agency' });
    await expect(agencyCard).toBeVisible();
    await expect(agencyCard.locator('text=Unlimited')).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    // Scroll to FAQ
    await page.locator('text=Frequently Asked Questions').scrollIntoViewIfNeeded();

    // Check for FAQ items
    await expect(page.locator('text=Can I change plans later?')).toBeVisible();
    await expect(page.locator('text=What happens when I hit my usage limits?')).toBeVisible();
    await expect(page.locator('text=Is there a free trial for paid plans?')).toBeVisible();
    await expect(page.locator('text=What payment methods do we accept?')).toBeVisible();
    await expect(page.locator('text=Can I cancel anytime?')).toBeVisible();
  });

  test('should display enterprise CTA section', async ({ page }) => {
    // Scroll to bottom for enterprise section
    await page.locator('text=Need an Enterprise Solution?').scrollIntoViewIfNeeded();

    await expect(page.locator('text=Need an Enterprise Solution?')).toBeVisible();
    await expect(page.locator('text=Contact Sales')).toBeVisible();
  });

  test('should have working upgrade buttons', async ({ page }) => {
    // Find upgrade buttons
    const upgradeButtons = page.locator('button:has-text("Upgrade")');
    const count = await upgradeButtons.count();

    // At least 3 plans should have upgrade buttons (Free, Starter, Pro, Agency)
    expect(count).toBeGreaterThanOrEqual(3);

    // Click first upgrade button and verify it navigates
    await upgradeButtons.first().click();

    // Should redirect to billing page
    await expect(page).toHaveURL(/\/billing/);
  });
});
