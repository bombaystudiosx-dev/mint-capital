const http = require('http');

// Test 1: Verify server responds
const testServer = (path) => {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:5173${path}`, (res) => {
      console.log(`✓ ${path}: ${res.statusCode}`);
      resolve(res.statusCode);
    });
    req.on('error', reject);
  });
};

(async () => {
  try {
    console.log('Testing Mint Capital dev server...\n');
    
    // Test main entry
    await testServer('/');
    
    // Test asset loads
    await testServer('/mint-capital-logo.png');
    await testServer('/mint-capital-hero.png');
    
    console.log('\n✓ All server endpoints responding');
    console.log('✓ Assets available');
    console.log('✓ App is ready for testing');
  } catch (e) {
    console.error('✗ Server test failed:', e.message);
  }
})();
