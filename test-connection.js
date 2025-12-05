// Test script to check frontend-backend connectivity
async function testConnection() {
  try {
    console.log('Testing connection to ViralClipCatch backend...');
    
    // Using the same API URL as in production
    const apiUrl = 'https://videodownloader-api-bfyj.onrender.com/api';
    
    console.log('Testing health endpoint...');
    const healthResponse = await fetch(`${apiUrl}/health`);
    console.log('Health check status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health check data:', healthData);
    
    console.log('\nTesting parse endpoint with a sample video...');
    const parseResponse = await fetch(`${apiUrl}/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://viralclipcatch.netlify.app'
      },
      body: JSON.stringify({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Rick Astley - Never Gonna Give You Up
      })
    });
    
    console.log('Parse request status:', parseResponse.status);
    if (parseResponse.ok) {
      const parseData = await parseResponse.json();
      console.log('Parse successful! Found formats:', parseData.formats?.length || 0);
    } else {
      const errorText = await parseResponse.text();
      console.log('Parse failed with text:', errorText);
    }
    
    console.log('\nTesting analytics endpoint...');
    const analyticsResponse = await fetch(`${apiUrl}/analytics/summary`, {
      headers: {
        'Origin': 'https://viralclipcatch.netlify.app'
      }
    });
    console.log('Analytics request status:', analyticsResponse.status);
    if (analyticsResponse.ok) {
      const analyticsData = await analyticsResponse.json();
      console.log('Analytics data:', analyticsData);
    } else {
      const errorText = await analyticsResponse.text();
      console.log('Analytics request failed:', errorText);
    }
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();