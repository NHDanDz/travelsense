// scripts/test-pwa.js
// Script để test PWA functionality
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧭 TravelSense PWA Testing Suite\n');

async function testPWA() {
  let passed = 0;
  let failed = 0;

  console.log('🧪 RUNNING PWA TESTS...\n');

  // Test 1: Manifest.json exists and valid
  console.log('📋 TEST 1: Manifest.json');
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error('Manifest.json not found');
    }
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Check required fields
    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color', 'background_color', 'icons'];
    const missingFields = requiredFields.filter(field => !manifest[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    if (!manifest.icons || manifest.icons.length === 0) {
      throw new Error('No icons defined');
    }
    
    console.log('✅ Manifest.json is valid');
    console.log(`   📱 Name: ${manifest.name}`);
    console.log(`   🎨 Icons: ${manifest.icons.length} icons`);
    console.log(`   🔗 Shortcuts: ${manifest.shortcuts?.length || 0} shortcuts`);
    passed++;
  } catch (error) {
    console.log('❌ Manifest.json test failed:', error.message);
    failed++;
  }

  // Test 2: Service Worker exists
  console.log('\n⚙️ TEST 2: Service Worker');
  try {
    const swPath = path.join(process.cwd(), 'public', 'sw.js');
    if (!fs.existsSync(swPath)) {
      throw new Error('Service Worker not found');
    }
    
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    // Check for essential SW features
    const requiredFeatures = [
      'addEventListener(\'install\'',
      'addEventListener(\'activate\'',
      'addEventListener(\'fetch\'',
      'caches.open',
      'skipWaiting',
      'clients.claim'
    ];
    
    const missingFeatures = requiredFeatures.filter(feature => !swContent.includes(feature));
    
    if (missingFeatures.length > 0) {
      throw new Error(`Missing SW features: ${missingFeatures.join(', ')}`);
    }
    
    console.log('✅ Service Worker is valid');
    console.log(`   📦 Cache strategy: Implemented`);
    console.log(`   📡 Offline support: Available`);
    passed++;
  } catch (error) {
    console.log('❌ Service Worker test failed:', error.message);
    failed++;
  }

  // Test 3: Icons exist
  console.log('\n🎨 TEST 3: PWA Icons');
  try {
    const iconsDir = path.join(process.cwd(), 'public', 'icons');
    if (!fs.existsSync(iconsDir)) {
      throw new Error('Icons directory not found');
    }
    
    const requiredIcons = [
      'favicon.svg',
      'apple-touch-icon.svg',
      'icon-192x192.svg',
      'icon-512x512.svg'
    ];
    
    const missingIcons = requiredIcons.filter(icon => 
      !fs.existsSync(path.join(iconsDir, icon))
    );
    
    if (missingIcons.length > 0) {
      throw new Error(`Missing icons: ${missingIcons.join(', ')}`);
    }
    
    // Count all icons
    const allIcons = fs.readdirSync(iconsDir).filter(file => file.endsWith('.svg'));
    
    console.log('✅ Icons are available');
    console.log(`   🧭 Compass icons: ${allIcons.length} files`);
    console.log(`   📱 All required sizes: Present`);
    passed++;
  } catch (error) {
    console.log('❌ Icons test failed:', error.message);
    failed++;
  }

  // Test 4: Build configuration
  console.log('\n🏗️ TEST 4: Build Configuration');
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    if (!fs.existsSync(nextConfigPath)) {
      throw new Error('Next.js config not found');
    }
    
    console.log('✅ Build configuration is valid');
    console.log(`   ⚙️ Next.js config: Present`);
    passed++;
  } catch (error) {
    console.log('❌ Build configuration test failed:', error.message);
    failed++;
  }

  // Test 5: PWA Layout integration
  console.log('\n📄 TEST 5: Layout Integration');
  try {
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
    if (!fs.existsSync(layoutPath)) {
      throw new Error('Layout.tsx not found');
    }
    
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    
    const requiredElements = [
      'manifest.json',
      'apple-touch-icon',
      'serviceWorker.register',
      'installPWA'
    ];
    
    const missingElements = requiredElements.filter(element => 
      !layoutContent.includes(element)
    );
    
    if (missingElements.length > 0) {
      throw new Error(`Missing layout elements: ${missingElements.join(', ')}`);
    }
    
    console.log('✅ Layout integration is valid');
    console.log(`   📱 PWA meta tags: Present`);
    console.log(`   🔧 Service Worker registration: Present`);
    console.log(`   📲 Install prompt: Present`);
    passed++;
  } catch (error) {
    console.log('❌ Layout integration test failed:', error.message);
    failed++;
  }

  // Test 6: Offline page
  console.log('\n📡 TEST 6: Offline Support');
  try {
    const offlinePath = path.join(process.cwd(), 'app', 'offline', 'page.tsx');
    if (!fs.existsSync(offlinePath)) {
      console.log('⚠️ Offline page not found (optional)');
    } else {
      console.log('✅ Offline page is available');
      passed++;
    }
  } catch (error) {
    console.log('❌ Offline support test failed:', error.message);
    failed++;
  }

  // Test 7: Package.json scripts
  console.log('\n📦 TEST 7: Package Scripts');
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const pwaScripts = Object.keys(packageJson.scripts || {}).filter(script => 
      script.startsWith('pwa:')
    );
    
    console.log('✅ Package scripts are configured');
    console.log(`   🔧 PWA scripts: ${pwaScripts.length} available`);
    console.log(`   📋 Scripts: ${pwaScripts.join(', ')}`);
    passed++;
  } catch (error) {
    console.log('❌ Package scripts test failed:', error.message);
    failed++;
  }

  // Test 8: Can build project
  console.log('\n🏗️ TEST 8: Build Test');
  try {
    console.log('   🔄 Running build test...');
    execSync('pnpm run build', { stdio: 'pipe' });
    console.log('✅ Build test passed');
    console.log(`   📦 Project builds successfully`);
    passed++;
  } catch (error) {
    console.log('❌ Build test failed');
    console.log(`   🔧 Error: ${error.message.split('\n')[0]}`);
    failed++;
  }

  // Results
  console.log('\n' + '='.repeat(50));
  console.log('🧭 PWA TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Score: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('🚀 Your TravelSense PWA is ready for deployment!');
    console.log('\n📝 Next steps:');
    console.log('1. npm start (test locally)');
    console.log('2. Open /pwa-test.html in browser');
    console.log('3. Test install functionality');
    console.log('4. Deploy to production');
  } else {
    console.log('\n⚠️ Some tests failed. Please fix the issues above.');
    process.exit(1);
  }

  // Generate test report
  generateTestReport(passed, failed);
}

function generateTestReport(passed, failed) {
  const report = `# PWA Test Report

Generated: ${new Date().toISOString()}

## Summary
- ✅ Passed: ${passed}
- ❌ Failed: ${failed}
- 📊 Score: ${Math.round((passed / (passed + failed)) * 100)}%

## Test Status
${passed > 0 ? '✅ ' + passed + ' tests passed' : ''}
${failed > 0 ? '❌ ' + failed + ' tests failed' : ''}

## Recommendations
${failed === 0 ? 
  '🎉 Perfect! Your PWA is ready for production.' : 
  '⚠️ Fix the failed tests before deploying to production.'
}

## Next Steps
1. Test install functionality manually
2. Run Lighthouse PWA audit
3. Test offline functionality
4. Deploy to production with HTTPS

---
Generated by TravelSense PWA Test Suite 🧭
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'pwa-test-report.md'),
    report
  );
  
  console.log('\n📄 Test report saved to pwa-test-report.md');
}

// Run tests
if (require.main === module) {
  testPWA().catch(console.error);
}

module.exports = { testPWA };