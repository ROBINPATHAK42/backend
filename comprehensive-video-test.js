// Comprehensive test script to check various video URLs
async function testVariousVideos() {
  try {
    console.log('Testing various video URLs...\n');
    
    // Using the same API URL as in production
    const apiUrl = 'https://videodownloader-api-bfyj.onrender.com/api';
    
    // Test videos - a mix of working and potentially problematic ones
    const testVideos = [
      {
        name: 'Public YouTube Video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Rick Astley - Never Gonna Give You Up
      },
      {
        name: 'Short YouTube URL',
        url: 'https://youtu.be/oUpsNvwqiRQ?si=Gywu3-dkGuwHqG-N' // The problematic video
      },
      {
        name: 'TikTok Video',
        url: 'https://www.tiktok.com/@scout2015/video/6718335390845095173'
      }
    ];
    
    for (const video of testVideos) {
      console.log(`\n--- Testing: ${video.name} ---`);
      console.log(`URL: ${video.url}`);
      
      try {
        const parseResponse = await fetch(`${apiUrl}/parse`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://viralclipcatch.netlify.app'
          },
          body: JSON.stringify({
            url: video.url
          })
        });
        
        console.log(`Parse request status: ${parseResponse.status}`);
        
        if (parseResponse.ok) {
          const parseData = await parseResponse.json();
          console.log(`✅ Success! Title: ${parseData.title}`);
          console.log(`   Platform: ${parseData.platform}`);
          console.log(`   Formats: ${parseData.formats?.length || 0} video, ${parseData.audio?.length || 0} audio`);
        } else {
          const errorText = await parseResponse.text();
          console.log(`❌ Failed with status ${parseResponse.status}`);
          
          try {
            const errorJson = JSON.parse(errorText);
            console.log(`   Error: ${errorJson.error}`);
          } catch (e) {
            console.log(`   Error text: ${errorText}`);
          }
        }
      } catch (error) {
        console.log(`❌ Network error: ${error.message}`);
      }
    }
    
    console.log('\n--- Test completed ---');
    
  } catch (error) {
    console.error('Test suite failed:', error);
  }
}

testVariousVideos();