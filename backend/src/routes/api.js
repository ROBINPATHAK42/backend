import { Router } from 'express';
import { parseUrl, getYoutubeFormats, streamYoutube } from '../services/youtube.js';
import { getYoutubeFormatsYtDlp, streamYoutubeYtDlp } from '../services/ytdlp.js';
import { recordEvent, getSummary, addActiveUser, removeActiveUser, addLiveVisitor, removeLiveVisitor, getRealtimeSummary } from '../services/analytics.js';

const router = Router();

// Remove manual CORS handling since we're handling it globally in server.js

router.post('/parse', async (req, res) => {
  try {
    const { url } = req.body || {};
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log(`Parsing URL: ${url}`);
    
    // Validate and identify platform
    const info = parseUrl(url);
    if (!info.supported) {
      return res.status(400).json({ 
        error: `Unsupported platform. Supported platforms: YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit.`,
        platform: info.platform
      });
    }
    
    console.log(`Platform identified: ${info.platform}`);
    
    let data;
    
    // Try yt-dlp first (more reliable), fallback to ytdl-core
    try {
      console.log('Attempting to fetch with yt-dlp...');
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

export default router;