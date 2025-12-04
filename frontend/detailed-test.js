// Detailed test script to check frontend-backend communication
async function detailedTest() {
  try {
    console.log('=== Detailed Connection Test ===');
    
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch('https://videodownloader-api-bfyj.onrender.com/api/health');
    console.log('Health status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health data:', healthData);
    
    // Test 2: Check if we can reach the parse endpoint at all
    console.log('\n2. Testing OPTIONS request to parse endpoint...');
    const optionsResponse = await fetch('https://videodownloader-api-bfyj.onrender.com/api/parse', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5174'
      }
    });
    console.log('OPTIONS status:', optionsResponse.status);
    console.log('Access-Control-Allow-Origin:', optionsResponse.headers.get('access-control-allow-origin'));
    
    // Test 3: Try parsing a video
    console.log('\n3. Testing video parse request...');
    const parseResponse = await fetch('https://videodownloader-api-bfyj.onrender.com/api/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174'
      },
      body: JSON.stringify({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Rick Astley - Never Gonna Give You Up
      })
    });
    
    console.log('Parse request status:', parseResponse.status);
    console.log('Parse response headers:', [...parseResponse.headers.entries()]);
    
    if (parseResponse.ok) {
      const parseData = await parseResponse.json();
      console.log('Parse successful! Found formats:', parseData.formats?.length || 0);
    } else {
      const errorText = await parseResponse.text();
      console.log('Parse failed with text:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        console.log('Parse failed with JSON:', errorData);
      } catch (e) {
        console.log('Parse failed, could not parse JSON');
      }
    }
    
  } catch (error) {
    console.error('Test failed with error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
  }
}

detailedTest();