// Test PWA functionality
console.log('🧭 Testing TravelSense PWA...');

const checks = [
  () => fetch('/manifest.json').then(r => r.json()),
  () => 'serviceWorker' in navigator,
  () => fs.existsSync('public/icons/icon-192x192.svg')
];

Promise.all(checks.map(check => {
  try { return check(); } catch { return false; }
})).then(results => {
  console.log('Manifest:', results[0] ? '✅' : '❌');
  console.log('Service Worker:', results[1] ? '✅' : '❌'); 
  console.log('Icons:', results[2] ? '✅' : '❌');
});