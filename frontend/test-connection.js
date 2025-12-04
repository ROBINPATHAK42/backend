// Simple test script to verify connection to backend
async function testConnection() {
  try {
    console.log('Testing connection to backend...');
    
    // Test health endpoint
    const healthResponse = await fetch('https://videodownloader-api-bfyj.onrender.com/api/health');
    console.log('Health check status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health check data:', healthData);
    
    // Test parse endpoint with a different video URL (one that doesn't require auth)
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
    const parseData = await parseResponse.json();
    console.log('Parse response data:', parseData);
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();