// Test script to check the specific video URL that's failing
async function testSpecificVideo() {
  try {
    console.log('Testing specific video URL: https://youtu.be/oUpsNvwqiRQ?si=Gywu3-dkGuwHqG-N');
    
    // Using the same API URL as in production
    const apiUrl = 'https://videodownloader-api-bfyj.onrender.com/api';
    
    console.log('Testing health endpoint...');
    const healthResponse = await fetch(`${apiUrl}/health`);
    console.log('Health check status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health check data:', healthData);
    
    console.log('\nTesting parse endpoint with the specific video...');
    const parseResponse = await fetch(`${apiUrl}/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://viralclipcatch.netlify.app'
      },
      body: JSON.stringify({
        url: 'https://youtu.be/oUpsNvwqiRQ?si=Gywu3-dkGuwHqG-N'
      })
    });
    
    console.log('Parse request status:', parseResponse.status);
    console.log('Parse request headers:', parseResponse.headers);
    
    if (parseResponse.ok) {
      const parseData = await parseResponse.json();
      console.log('Parse successful!');
      console.log('Title:', parseData.title);
      console.log('Platform:', parseData.platform);
      console.log('Formats found:', parseData.formats?.length || 0);
      console.log('Audio formats found:', parseData.audio?.length || 0);
      
      if (parseData.formats && parseData.formats.length > 0) {
        console.log('Video formats:');
        parseData.formats.forEach((format, index) => {
          console.log(`  ${index + 1}. ${format.qualityLabel} (${format.container}) - Has audio: ${format.hasAudio}`);
        });
      }
    } else {
      const errorText = await parseResponse.text();
      console.log('Parse failed with text:', errorText);
      
      // Try to parse as JSON if possible
      try {
        const errorJson = JSON.parse(errorText);
        console.log('Parsed error JSON:', errorJson);
      } catch (e) {
        console.log('Could not parse error as JSON');
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

testSpecificVideo();