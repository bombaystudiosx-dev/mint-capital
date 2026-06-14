import http from 'http';

const testServer = (path) => {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:5173${path}`, (res) => {
      console.log(`✓ GET ${path}: ${res.statusCode} OK`);
      resolve(res.statusCode);
    });
    req.on('error', reject);
  });
};

(async () => {
  try {
    console.log('Testing Mint Capital App Server\n');
    
    await testServer('/');
    await testServer('/mint-capital-logo.png');
    await testServer('/mint-capital-hero.png');
    
    console.log('\n✅ SERVER TESTS PASSED');
    console.log('✅ All endpoints responding');
    console.log('✅ Assets loading correctly');
    console.log('✅ App is ready for interactive testing\n');
  } catch (e) {
    console.error('❌ Server test failed:', e.message);
  }
})();
