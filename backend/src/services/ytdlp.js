import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { nanoid } from 'nanoid';

const execAsync = promisify(exec);

/**
 * Get yt-dlp command
 * Uses python -m yt_dlp which works regardless of PATH
 */
async function getYtDlpCommand() {
  try {
    // Try using Python module directly (most reliable on Windows)
    await execAsync('python -m yt_dlp --version');
    console.log('Using yt-dlp via Python module');
    return { command: 'python', args: ['-m', 'yt_dlp'] };
  } catch (err) {
    // Try python3
    try {
      await execAsync('python3 -m yt_dlp --version');
      console.log('Using yt-dlp via Python3 module');
      return { command: 'python3', args: ['-m', 'yt_dlp'] };
    } catch (err2) {
      // Fallback to direct executable
      const possiblePaths = [
        'yt-dlp',
        'yt-dlp.exe',
        path.join(process.env.APPDATA || '', 'Python', 'Python314', 'Scripts', 'yt-dlp.exe'),
      ];

      for (const ytdlpPath of possiblePaths) {
        try {
          await execAsync(`"${ytdlpPath}" --version`);
          console.log(`Found yt-dlp at: ${ytdlpPath}`);
          return { command: ytdlpPath, args: [] };
        } catch (err) {
          continue;
        }
      }

      // If we reach here, yt-dlp is not available
      console.error('yt-dlp not found. Video processing will fall back to ytdl-core.');
      throw new Error('yt-dlp not found. Please install it: pip install yt-dlp');
    }
  }
}

/**
 * Parse URL and get video information using yt-dlp
 * Supports: YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit, and more
 */
export async function getYoutubeFormatsYtDlp(url) {
  try {
    const { command, args } = await getYtDlpCommand();
    
    // Build command arguments array
    const cmdArgs = [
      ...args,
      '--dump-json',
      '--no-warnings',
      '--no-playlist',
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      url
    ];
    
    // Execute command
    let fullCommand;
    if (args.length > 0) {
      // Python module: python -m yt_dlp
      fullCommand = `"${command}" ${args.join(' ')} --dump-json --no-warnings --no-playlist --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${url}"`;
    } else {
      // Direct executable
      fullCommand = `"${command}" --dump-json --no-warnings --no-playlist --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${url}"`;
    }
    
    console.log('Executing yt-dlp command for URL:', url);
    const { stdout } = await execAsync(fullCommand, { maxBuffer: 10 * 1024 * 1024 }); // 10MB buffer
    
    const videoInfo = JSON.parse(stdout);
    
    // Extract video formats (with video stream)
    // For some platforms (TikTok, Instagram), formats might be limited
    const videoFormats = (videoInfo.formats || [])
      .filter(f => f.vcodec && f.vcodec !== 'none')
      .sort((a, b) => (b.height || 0) - (a.height || 0));
    
    // Create unique quality map prioritizing formats with audio
    const videoFormatsMap = new Map();
    videoFormats.forEach(f => {
      const key = f.height || f.format_id;
      const hasAudio = f.acodec && f.acodec !== 'none';
      
      if (!videoFormatsMap.has(key) || hasAudio) {
        videoFormatsMap.set(key, {
          itag: f.format_id,
          qualityLabel: f.format_note || (f.height ? `${f.height}p` : f.format),
          container: f.ext || 'mp4',
          size: f.filesize || f.filesize_approx,
          hasAudio: hasAudio,
          fps: f.fps || 30,
          height: f.height || 0
        });
      }
    });
    
    const formats = Array.from(videoFormatsMap.values());
    
    // Extract audio-only formats
    const audioFormats = (videoInfo.formats || [])
      .filter(f => f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none'))
      .sort((a, b) => (b.abr || 0) - (a.abr || 0))
      .map(f => ({
        itag: f.format_id,
        bitrate: Math.round(f.abr || 0),
        container: f.ext || 'mp4',
        size: f.filesize || f.filesize_approx,
        audioQuality: f.audio_ext || 'medium'
      }));
    
    return {
      id: videoInfo.id,
      title: videoInfo.title || 'Untitled',
      author: videoInfo.uploader || videoInfo.channel || 'Unknown',
      thumbnails: videoInfo.thumbnails?.map(t => ({ url: t.url, width: t.width, height: t.height })) || [],
      duration: videoInfo.duration || 0,
      formats,
      audio: audioFormats,
      token: nanoid(10)
    };
  } catch (err) {
    console.error('yt-dlp error:', err.message);
    console.error('Full error:', err.stderr || err.stdout || err.stack);
    
    // Provide more helpful error messages
    let errorMessage = err.message;
    if (err.message.includes('Unsupported URL')) {
      errorMessage = 'This URL is not supported. Please check if it\'s a valid video URL.';
    } else if (err.message.includes('Video unavailable')) {
      errorMessage = 'This video is unavailable. It may be private, deleted, or region-restricted.';
    } else if (err.message.includes('HTTP Error 404')) {
      errorMessage = 'Video not found (404). The URL may be incorrect or the video was removed.';
    } else if (err.message.includes('HTTP Error 403')) {
      errorMessage = 'Access forbidden (403). The video may be private or age-restricted.';
    }
    
    throw new Error(`Failed to fetch video information: ${errorMessage}`);
  }
}

/**
 * Download and stream video using yt-dlp
 * Supports: YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit, and more
 */
export async function streamYoutubeYtDlp({ url, itag, type }, res) {
  try {
    const { command, args: baseArgs } = await getYtDlpCommand();
    
    // Build yt-dlp command
    let formatArg;
    if (itag) {
      formatArg = itag;
    } else if (type === 'audio') {
      formatArg = 'bestaudio';
    } else {
      formatArg = 'best';
    }
    
    // Get video info for filename
    let filename = 'ViralClipCatch';
    try {
      const cmdArgs = [...baseArgs, '--get-filename', '-o', '%(title)s', '--no-warnings', url];
      const { stdout } = await execAsync(
        `"${command}" ${cmdArgs.join(' ')}`
      );
      filename = stdout.trim()
        .replace(/[^a-z0-9\-\s_\[\]\(\)\.]/gi, ' ')
        .trim()
        .slice(0, 80) || 'ViralClipCatch';
    } catch (err) {
      console.error('Error getting filename:', err.message);
    }
    
    const ext = type === 'audio' ? 'mp3' : 'mp4';
    
    // Set response headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.${ext}"`);
    res.setHeader('Content-Type', type === 'audio' ? 'audio/mpeg' : 'video/mp4');
    
    // Build download command with user-agent for social media compatibility
    const downloadArgs = [
      ...baseArgs,
      '-f', formatArg,
      '--no-warnings',
      '--no-playlist',
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '--referer', url,
      '-o', '-',  // Output to stdout
      url
    ];
    
    // Add audio extraction if type is audio
    if (type === 'audio') {
      downloadArgs.splice(baseArgs.length, 0, '-x', '--audio-format', 'mp3');
    }
    
    console.log(`Starting yt-dlp download: ${command} ${downloadArgs.join(' ')}`);
    
    // Spawn yt-dlp process
    const ytdlp = spawn(command, downloadArgs);
    
    let downloadedBytes = 0;
    
    // Pipe stdout to response
    ytdlp.stdout.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      res.write(chunk);
    });
    
    // Log errors from stderr (yt-dlp uses stderr for progress)
    ytdlp.stderr.on('data', (data) => {
      const message = data.toString();
      // Only log actual errors, not progress
      if (message.includes('ERROR') || message.includes('error')) {
        console.error('yt-dlp stderr:', message);
      }
    });
    
    // Handle process completion
    ytdlp.on('close', (code) => {
      if (code === 0) {
        console.log(`Download completed. Total bytes: ${downloadedBytes}`);
        res.end();
      } else {
        console.error(`yt-dlp exited with code ${code}`);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
        } else {
          res.end();
        }
      }
    });
    
    // Handle errors
    ytdlp.on('error', (err) => {
      console.error('yt-dlp process error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to start download process' });
      } else {
        res.end();
      }
    });
    
    // Handle client disconnect
    res.on('close', () => {
      if (ytdlp && !ytdlp.killed) {
        console.log('Client disconnected, killing yt-dlp process');
        ytdlp.kill();
      }
    });
    
  } catch (err) {
    console.error('Error streaming with yt-dlp:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
}
