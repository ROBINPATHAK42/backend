import { Router } from 'express';
import { parseUrl, getYoutubeFormats, streamYoutube } from '../services/youtube.js';
import { getYoutubeFormatsYtDlp, streamYoutubeYtDlp } from '../services/ytdlp.js';
import { recordEvent, getSummary, addActiveUser, removeActiveUser, addLiveVisitor, removeLiveVisitor, incrementTodayDownloads, getRealtimeSummary } from '../services/analytics.js';

const router = Router();

router.post('/parse', async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    
    const { url } = req.body || {};
    
    console.log('Extracted URL:', url);
    
    if (!url || !url.trim()) {
      return res.status(400).json({ error: 'Please provide a valid URL' });
    }
    
    console.log('Parsing URL:', url);
    const info = await parseUrl(url);
    
    if (!info.supported) {
      const platformMsg = info.platform !== 'unknown' 
        ? `${info.platform} is not supported yet` 
        : 'This platform is not supported yet';
      return res.status(400).json({ 
        error: platformMsg, 
        platform: info.platform 
      });
    }
    
    console.log('Fetching formats for:', info.platform);
    
    // Try yt-dlp first (more reliable), fallback to ytdl-core
    let data;
    try {
      console.log('Trying yt-dlp...');
      data = await getYoutubeFormatsYtDlp(url);
      console.log(`yt-dlp: Found ${data.formats?.length || 0} video formats and ${data.audio?.length || 0} audio formats`);
    } catch (ytdlpError) {
      console.warn('yt-dlp failed:', ytdlpError.message);
      
      // Only fallback to ytdl-core for YouTube
      if (info.platform === 'youtube') {
        console.log('Falling back to ytdl-core for YouTube...');
        try {
          data = await getYoutubeFormats(url);
          console.log(`ytdl-core: Found ${data.formats?.length || 0} video formats and ${data.audio?.length || 0} audio formats`);
        } catch (ytdlError) {
          console.error('Both yt-dlp and ytdl-core failed:', ytdlError.message);
          throw new Error(`Failed to fetch video. ${ytdlpError.message}`);
        }
      } else {
        // For non-YouTube platforms, throw the yt-dlp error
        throw ytdlpError;
      }
    }
    
    // Add warning if no formats are available
    if (data.formats.length === 0 && data.audio.length === 0) {
      return res.status(400).json({ 
        error: `No downloadable formats found for this ${info.platform} video. The video may be private, age-restricted, or unavailable.`,
        platform: info.platform
      });
    }
    
    res.json({ ...data, platform: info.platform });
  } catch (e) {
    console.error('Parse error:', e.message);
    console.error('Error stack:', e.stack);
    res.status(400).json({ 
      error: e.message || 'Failed to parse URL. Please check the URL and try again.' 
    });
  }
});

router.get('/download', async (req, res) => {
  try {
    const { url, itag, type } = req.query;
    
    if (!url || !itag) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    console.log(`Starting download - Type: ${type}, Itag: ${itag}`);
    
    // Record the download event before starting the download
    recordEvent('download');
    
    // Try yt-dlp first (more reliable), fallback to ytdl-core
    try {
      console.log('Downloading with yt-dlp...');
      await streamYoutubeYtDlp({ url, itag, type }, res);
    } catch (ytdlpError) {
      console.warn('yt-dlp download failed, trying ytdl-core:', ytdlpError.message);
      if (!res.headersSent) {
        await streamYoutube({ url, itag, type }, res);
      } else {
        throw ytdlpError;
      }
    }
  } catch (e) {
    console.error('Download error:', e.message);
    if (!res.headersSent) {
      res.status(400).json({ error: e.message || 'Download failed' });
    }
  }
});

router.post('/analytics/event', (req, res) => {
  const { type } = req.body || {};
  if (!type) return res.status(400).json({ error: 'Missing type' });
  const summary = recordEvent(type);
  res.json(summary);
});

router.get('/analytics/summary', (_req, res) => {
  res.json(getSummary());
});

// Real-time analytics endpoints
router.post('/analytics/active-user', (req, res) => {
  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  const summary = addActiveUser(sessionId);
  res.json(summary);
});

router.delete('/analytics/active-user/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  const summary = removeActiveUser(sessionId);
  res.json(summary);
});

router.post('/analytics/live-visitor', (req, res) => {
  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  const summary = addLiveVisitor(sessionId);
  res.json(summary);
});

router.delete('/analytics/live-visitor/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  const summary = removeLiveVisitor(sessionId);
  res.json(summary);
});

router.get('/analytics/realtime', (_req, res) => {
  res.json(getRealtimeSummary());
});

export default router;// Explicitly handle OPTIONS requests for CORS
router.options('/parse', (req, res) => {
  console.log('OPTIONS request received for /parse');
  console.log('Origin header:', req.get('Origin'));
  res.sendStatus(204);
});

router.options('/download', (req, res) => {
  console.log('OPTIONS request received for /download');
  console.log('Origin header:', req.get('Origin'));
  res.sendStatus(204);
});
