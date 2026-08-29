const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function makeRequest(path, method = 'POST', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const headers = { 'Content-Type': 'application/json' };
    const options = { method, headers };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log("Testing auth limiter on /api/auth/login...");
  
  // The authLimiter allows 10 requests per 15 minutes.
  // We will send 12 requests. The first 10 should be 400/401/200, the last 2 should be 429.
  for (let i = 1; i <= 12; i++) {
    const res = await makeRequest('/auth/login', 'POST', { email: `test${i}@test.com`, password: 'password' });
    console.log(`Req ${i}: ${res.status}`);
    
    if (res.status === 429) {
      console.log("Rate limit triggered successfully:");
      console.log(res.data);
      break;
    }
  }

  console.log("\nChecking Security Headers on /api/health...");
  const healthRes = await makeRequest('/health', 'GET');
  console.log("Status:", healthRes.status);
  
  const relevantHeaders = [
    'content-security-policy',
    'x-content-type-options',
    'x-frame-options',
    'strict-transport-security',
    'x-xss-protection'
  ];
  
  relevantHeaders.forEach(h => {
    if (healthRes.headers[h]) {
      console.log(`${h}: ${healthRes.headers[h]}`);
    }
  });
}

runTests().catch(console.error);
