#!/usr/bin/env node

/**
 * Test script to verify AI features on analytics pages
 * This script authenticates with the demo token and checks for AI feature presence
 */

import { writeFileSync } from 'fs';

const BASE_URL = 'http://localhost:3000';

// Helper to make authenticated requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        ...options.headers,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    throw error;
  }
}

// Step 1: Authenticate with demo token
async function authenticate() {
  console.log('\n🔐 Step 1: Authenticating with demo token...');
  
  // First, get the login page to establish session
  const loginPageResponse = await makeRequest(`${BASE_URL}/login`);
  const cookies = loginPageResponse.headers.get('set-cookie') || '';
  
  console.log('✓ Login page loaded');
  
  // Try to sign in via the API
  const signInResponse = await makeRequest(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies,
    },
    body: new URLSearchParams({
      apiToken: 'demo',
      redirect: 'false',
    }),
    redirect: 'manual',
  });
  
  // Get all cookies from the sign-in response
  const authCookies = signInResponse.headers.get('set-cookie') || cookies;
  console.log('✓ Authentication request sent');
  
  return authCookies;
}

// Step 2: Check Overview page for AI features
async function checkOverviewPage(cookies) {
  console.log('\n📊 Step 2: Checking Overview page (http://localhost:3000/analytics)...');
  
  const response = await makeRequest(`${BASE_URL}/analytics`, {
    headers: {
      'Cookie': cookies,
    },
  });
  
  const html = await response.text();
  
  // Save HTML for inspection
  writeFileSync('overview-page.html', html);
  console.log('  → Saved HTML to overview-page.html');
  
  const checks = {
    'AI Summary banner (purple/violet)': 
      html.includes('AI Summary') || html.includes('ai-summary') || html.includes('bg-violet') || html.includes('bg-purple'),
    'Ask AI button in Missed Opportunities': 
      html.includes('Ask AI') && html.includes('Missed Opportunities'),
    'Floating AI button (bottom-right)': 
      html.includes('floating') || html.includes('fixed') && html.includes('AI'),
    'Sidebar Ask AI button with New badge': 
      html.includes('Ask AI') && html.includes('New'),
    'AI Analytics Agent': 
      html.includes('AI Analytics Agent') || html.includes('ai-chat'),
  };
  
  console.log('\n  Results:');
  for (const [feature, found] of Object.entries(checks)) {
    console.log(`  ${found ? '✓' : '✗'} ${feature}`);
  }
  
  return checks;
}

// Step 3: Check Automation page
async function checkAutomationPage(cookies) {
  console.log('\n🤖 Step 3: Checking Automation page (http://localhost:3000/analytics/automation)...');
  
  const response = await makeRequest(`${BASE_URL}/analytics/automation`, {
    headers: {
      'Cookie': cookies,
    },
  });
  
  const html = await response.text();
  
  // Save HTML for inspection
  writeFileSync('automation-page.html', html);
  console.log('  → Saved HTML to automation-page.html');
  
  const checks = {
    'AI Summary banner': 
      html.includes('AI Summary') || html.includes('ai-summary'),
    'Ask AI buttons on flows': 
      html.includes('Ask AI') && (html.includes('flow') || html.includes('leaderboard')),
  };
  
  console.log('\n  Results:');
  for (const [feature, found] of Object.entries(checks)) {
    console.log(`  ${found ? '✓' : '✗'} ${feature}`);
  }
  
  return checks;
}

// Step 4: Check Content page
async function checkContentPage(cookies) {
  console.log('\n📝 Step 4: Checking Content page (http://localhost:3000/analytics/content)...');
  
  const response = await makeRequest(`${BASE_URL}/analytics/content`, {
    headers: {
      'Cookie': cookies,
    },
  });
  
  const html = await response.text();
  
  // Save HTML for inspection
  writeFileSync('content-page.html', html);
  console.log('  → Saved HTML to content-page.html');
  
  const checks = {
    'AI Summary banner': 
      html.includes('AI Summary') || html.includes('ai-summary'),
    'Ask AI / How to replicate / Analyze buttons': 
      (html.includes('Ask AI') || html.includes('How to replicate') || html.includes('Analyze')) && html.includes('content'),
  };
  
  console.log('\n  Results:');
  for (const [feature, found] of Object.entries(checks)) {
    console.log(`  ${found ? '✓' : '✗'} ${feature}`);
  }
  
  return checks;
}

// Main execution
async function main() {
  console.log('🚀 Testing AI Features on Analytics Dashboard');
  console.log('='.repeat(60));
  
  try {
    // Check if server is running
    try {
      await makeRequest(BASE_URL);
    } catch (error) {
      console.error('\n❌ Error: Server is not running at http://localhost:3000');
      console.log('Please start the server with: npm run dev');
      process.exit(1);
    }
    
    const cookies = await authenticate();
    const overviewResults = await checkOverviewPage(cookies);
    const automationResults = await checkAutomationPage(cookies);
    const contentResults = await checkContentPage(cookies);
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 SUMMARY');
    console.log('='.repeat(60));
    
    const allChecks = {
      'Overview Page': overviewResults,
      'Automation Page': automationResults,
      'Content Page': contentResults,
    };
    
    let totalChecks = 0;
    let passedChecks = 0;
    
    for (const [page, checks] of Object.entries(allChecks)) {
      console.log(`\n${page}:`);
      for (const [feature, passed] of Object.entries(checks)) {
        totalChecks++;
        if (passed) passedChecks++;
        console.log(`  ${passed ? '✓' : '✗'} ${feature}`);
      }
    }
    
    console.log(`\n${passedChecks}/${totalChecks} checks passed`);
    
    if (passedChecks === totalChecks) {
      console.log('\n✅ All AI features are present!');
    } else {
      console.log('\n⚠️  Some AI features may be missing or not detected.');
      console.log('Check the saved HTML files for manual inspection:');
      console.log('  - overview-page.html');
      console.log('  - automation-page.html');
      console.log('  - content-page.html');
    }
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    process.exit(1);
  }
}

main();
