import ytdl from '@distube/ytdl-core';
import { nanoid } from 'nanoid';

// Create agent with custom options for better reliability
const agent = ytdl.createAgent(undefined, {
  localAddress: undefined,
});

// Enhanced options to bypass YouTube restrictions using multiple clients
const getYtdlOptions = (useAndroidClient = false) => {
  const options = {
    agent,
    requestOptions: {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    },
  };
  
  // Use Android client for better compatibility (bypasses some restrictions)
  if (useAndroidClient) {
    options.clients = ['android', 'web'];
  }
  
  return options;
};

export function parseUrl(url) {
  try {
    const u = (url || '').trim();
    if (!u) throw new Error('Empty URL');
    
    // More comprehensive YouTube URL validation
    const yt = /(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/|embed\/|v\/)|youtu\.be\/)([\w-]{11})/i.test(u);
    if (yt) return { supported: true, platform: 'youtube' };
    
    // Check for other supported platforms (via yt-dlp)
    if (/tiktok\.com/i.test(u)) return { supported: true, platform: 'tiktok' };
    if (/instagram\.com/i.test(u)) return { supported: true, platform: 'instagram' };
    if (/facebook\.com|fb\.watch/i.test(u)) return { supported: true, platform: 'facebook' };
    if (/twitter\.com|x\.com/i.test(u)) return { supported: true, platform: 'twitter' };
    if (/reddit\.com/i.test(u)) return { supported: true, platform: 'reddit' };
    
    // Unknown platform
    return { supported: false, platform: 'unknown' };
  } catch (err) {
    return { supported: false, platform: 'unknown', error: err.message };
  }
}

export async function getYoutubeFormats(url) {
  try {
    // Validate URL first
    if (!ytdl.validateURL(url)) {
      throw new Error('Invalid YouTube URL. Please provide a valid YouTube video URL.');
    }
    
    // Get video info with enhanced options for better reliability
    // Try Android client first for better success rate
    const info = await ytdl.getInfo(url, getYtdlOptions(true));
    const videoDetails = info.videoDetails;
    
    if (!info.formats || info.formats.length === 0) {
      throw new Error('No formats available for this video');
    }
    
    // Get all video formats (with or without audio)
    // This includes formats with both video+audio and video-only
    // Filter out formats without URLs (decipher failed)
    const allVideoFormats = info.formats.filter(f => 
      f.hasVideo && 
      f.qualityLabel && 
      (f.url || f.signatureCipher) // Only include if URL is available or can be deciphered
    );
    
    console.log(`Total formats: ${info.formats.length}, Video formats with URLs: ${allVideoFormats.length}`);
    
    // Prioritize formats with both video and audio
    const combinedFormats = allVideoFormats.filter(f => f.hasAudio && f.hasVideo);
    
    // If no combined formats, get video-only formats
    const videoOnlyFormats = allVideoFormats.filter(f => !f.hasAudio);
    
    // Merge and deduplicate by quality
    const videoFormatsMap = new Map();
    
    [...combinedFormats, ...videoOnlyFormats].forEach(f => {
      const key = f.qualityLabel || f.height;
      if (!videoFormatsMap.has(key) || (f.hasAudio && f.hasVideo)) {
        videoFormatsMap.set(key, f);
      }
    });
    
    const formats = Array.from(videoFormatsMap.values())
      .sort((a, b) => (b.height || 0) - (a.height || 0))
      .map(f => ({
        itag: f.itag,
        qualityLabel: f.qualityLabel || `${f.height}p`,
        container: f.container || 'mp4',
        size: f.contentLength ? Number(f.contentLength) : undefined,
        hasAudio: f.hasAudio || false,
        fps: f.fps || 30
      }));
    
    // Get all audio formats (only those with accessible URLs)
    const audio = ytdl
      .filterFormats(info.formats, 'audioonly')
      .filter(f => f.url || f.signatureCipher) // Only include if URL is available
      .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))
      .map(f => ({
        itag: f.itag,
        bitrate: f.audioBitrate || 0,
        container: f.container || 'mp4',
        size: f.contentLength ? Number(f.contentLength) : undefined,
        audioQuality: f.audioQuality || 'medium'
      }));
    
    console.log(`Audio formats with URLs: ${audio.length}`);
    
    if (formats.length === 0 && audio.length === 0) {
      throw new Error('No downloadable formats found. YouTube may be blocking downloads for this video due to anti-bot measures. Please try a different video or try again later.');
    }
    
    // Warn if no video formats with audio
    if (formats.length === 0 && audio.length > 0) {
      console.warn('WARNING: This video has no combined video+audio formats. Only audio download or a different video is available.');
    }
    
    return {
      id: videoDetails.videoId,
      title: videoDetails.title || 'Untitled',
      author: videoDetails.author?.name || 'Unknown',
      thumbnails: videoDetails.thumbnails || [],
      duration: Number(videoDetails.lengthSeconds) || 0,
      formats,
      audio,
      token: nanoid(10)
    };
  } catch (err) {
    console.error('Error fetching YouTube formats:', err.message);
    throw new Error(`Failed to fetch video information: ${err.message}`);
  }
}

export async function streamYoutube({ url, itag, type }, res) {
  try {
    if (!ytdl.validateURL(url)) {
      throw new Error('Invalid YouTube URL');
    }
    
    // Get video info first to select the best format
    console.log(`Fetching video info for download - itag: ${itag}, type: ${type}`);
    const info = await ytdl.getInfo(url, getYtdlOptions(true));
    
    // Configure download options
    const downloadOptions = {
      agent
    };
    
    // Set quality and filter based on type and itag
    if (itag) {
      // When specific itag is provided, find that format
      const selectedFormat = info.formats.find(f => String(f.itag) === String(itag));
      if (!selectedFormat) {
        throw new Error(`Format ${itag} not found. Please try a different quality.`);
      }
      
      console.log(`Selected format: ${selectedFormat.qualityLabel || selectedFormat.quality}, hasAudio: ${selectedFormat.hasAudio}, url exists: ${!!selectedFormat.url}`);
      
      // Check if URL is available (if not, decipher failed)
      if (!selectedFormat.url && !selectedFormat.signatureCipher) {
        throw new Error('This video format is currently unavailable due to YouTube restrictions. This is a known issue with YouTube\'s anti-bot measures. Please try again later or use a different video.');
      }
      
      // Use the format directly if URL is available
      if (selectedFormat.url) {
        downloadOptions.format = selectedFormat;
      } else {
        downloadOptions.quality = itag;
      }
    } else {
      // When no itag specified, use filters
      downloadOptions.quality = 'highest';
      if (type === 'audio') {
        downloadOptions.filter = 'audioonly';
      } else {
        downloadOptions.filter = 'videoandaudio';
      }
    }
    
    // Try to get filename
    let filename = 'ViralClipCatch';
    try {
      const info = await ytdl.getInfo(url, getYtdlOptions(true));
      filename = (info.videoDetails.title || 'ViralClipCatch')
        .replace(/[^a-z0-9\-\s_\[\]\(\)\.]/gi, ' ')
        .trim()
        .slice(0, 80) || 'ViralClipCatch';
    } catch (err) {
      console.error('Error fetching video title:', err.message);
    }
    
    const ext = type === 'audio' ? 'mp3' : 'mp4';
    
    // Merge download options with enhanced options (use Android client)
    const finalOptions = { ...getYtdlOptions(true), ...downloadOptions };
    const stream = ytdl(url, finalOptions);
    
    // Wait for stream response to get content length
    stream.once('response', (response) => {
      console.log('Stream started, status:', response.statusCode);
      
      // Set headers after we know the stream is valid
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.${ext}"`);
      res.setHeader('Content-Type', type === 'audio' ? 'audio/mpeg' : 'video/mp4');
      
      // Set content length if available
      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
        console.log('Content-Length:', response.headers['content-length']);
      }
    });
    
    // Track progress
    let downloadedBytes = 0;
    stream.on('data', (chunk) => {
      downloadedBytes += chunk.length;
    });
    
    // Handle stream errors
    stream.on('error', (err) => {
      console.error('Stream error:', err.message);
      if (!res.headersSent) {
        let errorMsg = 'Failed to stream video';
        if (err.message.includes('403') || err.message.includes('Status code: 403')) {
          errorMsg = 'YouTube blocked this download. Try selecting a format with audio (not "No audio" formats), or try a different quality.';
        }
        res.status(500).json({ error: errorMsg });
      } else {
        res.end();
      }
    });
    
    // Handle completion
    stream.on('end', () => {
      console.log('Download completed. Total bytes:', downloadedBytes);
    });
    
    stream.pipe(res);
  } catch (err) {
    console.error('Error streaming YouTube:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
}
