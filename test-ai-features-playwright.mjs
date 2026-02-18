#!/usr/bin/env node

/**
 * Playwright test script to verify AI features on analytics pages
 */

import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';

const BASE_URL = 'http://localhost:3000';

async function takeScreenshot(page, name) {
  const filename = `screenshot-${name}.png`;
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`  📸 Screenshot saved: ${filename}`);
  return filename;
}

async function main() {
  console.log('🚀 Testing AI Features on Analytics Dashboard with Playwright');
  console.log('='.repeat(70));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  try {
    // Step 1: Navigate to login and authenticate
    console.log('\n🔐 Step 1: Authenticating with demo token...');
    await page.goto(`${BASE_URL}/login`);
    await takeScreenshot(page, '01-login-page');

    // Fill in the demo token
    await page.fill('input[name="apiToken"]', 'demo');
    await page.click('button[type="submit"]');

    // Wait for navigation to analytics page
    await page.waitForURL('**/analytics', { timeout: 10000 });
    console.log('✓ Successfully authenticated and redirected to analytics');

    // Step 2: Check Overview page
    console.log('\n📊 Step 2: Checking Overview page (http://localhost:3000/analytics)...');
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, '02-overview-page');

    const overviewChecks = {
      'AI Summary banner (purple/violet)': false,
      'Ask AI button in Missed Opportunities': false,
      'Floating AI button (bottom-right)': false,
      'Sidebar Ask AI button with New badge': false,
    };

    // Check for AI Summary banner
    const aiSummaryBanner = await page.locator('text=AI Summary').count();
    overviewChecks['AI Summary banner (purple/violet)'] = aiSummaryBanner > 0;

    // Check for Ask AI button in Missed Opportunities section
    const missedOpportunitiesSection = page.locator('text=Missed Opportunities').first();
    if (await missedOpportunitiesSection.count() > 0) {
      const askAIInMissed = await page.locator('text=Ask AI').count();
      overviewChecks['Ask AI button in Missed Opportunities'] = askAIInMissed > 0;
    }

    // Check for floating AI button (bottom-right)
    const floatingAIButton = await page.locator('button:has-text("AI"), [class*="fixed"]:has-text("AI")').count();
    overviewChecks['Floating AI button (bottom-right)'] = floatingAIButton > 0;

    // Check for sidebar Ask AI button with New badge
    const sidebarAskAI = await page.locator('text=Ask AI').count();
    const newBadge = await page.locator('text=New').count();
    overviewChecks['Sidebar Ask AI button with New badge'] = sidebarAskAI > 0 && newBadge > 0;

    console.log('\n  Results:');
    for (const [feature, found] of Object.entries(overviewChecks)) {
      console.log(`  ${found ? '✓' : '✗'} ${feature}`);
    }

    // Step 3: Try to click floating AI button if it exists
    console.log('\n💬 Step 3: Testing AI Chat Panel...');
    const floatingButton = page.locator('button:has-text("AI")').first();
    if (await floatingButton.count() > 0) {
      console.log('  → Clicking floating AI button...');
      await floatingButton.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '03-ai-chat-panel');

      // Check for AI Analytics Agent title
      const aiAgentTitle = await page.locator('text=AI Analytics Agent').count();
      const suggestedQueries = await page.locator('text=What should I do this week').count();

      console.log(`  ${aiAgentTitle > 0 ? '✓' : '✗'} AI Analytics Agent title visible`);
      console.log(`  ${suggestedQueries > 0 ? '✓' : '✗'} Suggested queries visible`);

      // Try clicking a suggested query
      const suggestedQuery = page.locator('text=What should I do this week').first();
      if (await suggestedQuery.count() > 0) {
        console.log('  → Clicking suggested query...');
        await suggestedQuery.click();
        await page.waitForTimeout(2000);
        await takeScreenshot(page, '04-ai-chat-response');

        const hasResponse = await page.locator('[class*="message"], [class*="response"]').count();
        console.log(`  ${hasResponse > 0 ? '✓' : '✗'} AI response received`);
      }

      // Close the chat panel
      const closeButton = page.locator('button:has-text("Close"), button[aria-label*="close"]').first();
      if (await closeButton.count() > 0) {
        await closeButton.click();
        await page.waitForTimeout(500);
      }
    } else {
      console.log('  ✗ Floating AI button not found, skipping chat test');
    }

    // Step 4: Navigate to Automation page
    console.log('\n🤖 Step 4: Checking Automation page...');
    await page.goto(`${BASE_URL}/analytics/automation`);
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, '05-automation-page');

    const automationChecks = {
      'AI Summary banner': false,
      'Ask AI buttons on flows': false,
    };

    const automationAISummary = await page.locator('text=AI Summary').count();
    automationChecks['AI Summary banner'] = automationAISummary > 0;

    const flowAskAI = await page.locator('text=Ask AI').count();
    automationChecks['Ask AI buttons on flows'] = flowAskAI > 0;

    console.log('\n  Results:');
    for (const [feature, found] of Object.entries(automationChecks)) {
      console.log(`  ${found ? '✓' : '✗'} ${feature}`);
    }

    // Step 5: Navigate to Content page
    console.log('\n📝 Step 5: Checking Content page...');
    await page.goto(`${BASE_URL}/analytics/content`);
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, '06-content-page');

    const contentChecks = {
      'AI Summary banner': false,
      'Ask AI / How to replicate / Analyze buttons': false,
    };

    const contentAISummary = await page.locator('text=AI Summary').count();
    contentChecks['AI Summary banner'] = contentAISummary > 0;

    const contentButtons = await page.locator('text=Ask AI, text=How to replicate, text=Analyze').count();
    contentChecks['Ask AI / How to replicate / Analyze buttons'] = contentButtons > 0;

    console.log('\n  Results:');
    for (const [feature, found] of Object.entries(contentChecks)) {
      console.log(`  ${found ? '✓' : '✗'} ${feature}`);
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📋 SUMMARY');
    console.log('='.repeat(70));

    const allChecks = {
      'Overview Page': overviewChecks,
      'Automation Page': automationChecks,
      'Content Page': contentChecks,
    };

    let totalChecks = 0;
    let passedChecks = 0;

    for (const [pageName, checks] of Object.entries(allChecks)) {
      console.log(`\n${pageName}:`);
      for (const [feature, passed] of Object.entries(checks)) {
        totalChecks++;
        if (passed) passedChecks++;
        console.log(`  ${passed ? '✓' : '✗'} ${feature}`);
      }
    }

    console.log(`\n${passedChecks}/${totalChecks} checks passed`);

    if (passedChecks === totalChecks) {
      console.log('\n✅ All AI features are present and working!');
    } else {
      console.log('\n⚠️  Some AI features may be missing or not visible.');
      console.log('Check the screenshots for visual inspection.');
    }

  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    await takeScreenshot(page, 'error');
    throw error;
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
