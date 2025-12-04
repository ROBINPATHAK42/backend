# ViralClipCatch.com

All-in-one multi-platform social media video downloader. Frontend: Vite + React + Tailwind. Backend: Node + Express + yt-dlp. Analytics stored in JSON with an easy path to Supabase/Firebase.

## ✨ Supported Platforms

- ✅ **YouTube** (videos, shorts, live streams)
- ✅ **TikTok** (videos)
- ✅ **Instagram** (posts, reels, stories)
- ✅ **Facebook** (videos, watch)
- ✅ **Twitter/X** (videos, GIFs)
- ✅ **Reddit** (videos)
- 🔄 **More platforms supported by yt-dlp**

## Features
- 🌐 **Multi-platform support**: YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit, and more
- 🎬 Universal URL input with automatic platform detection
- 🎯 Quality selection: video and audio formats
- 📊 Live analytics widgets (today downloads, active users, live visitors)
- 🔗 Share, copy, paste helpers
- 🌙 Dark/light mode
- 📢 SEO optimized: meta tags, Open Graph, JSON-LD, robots.txt, sitemap.xml
- ⚡ Powered by yt-dlp for maximum compatibility and reliability

## Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.7 or higher)
- **yt-dlp**: Install via `pip install yt-dlp`
  ```bash
  # Install yt-dlp
  pip install yt-dlp
  
  # Verify installation
  python -m yt_dlp --version
  ```

## Local Setup

1. **Backend**
   - Copy env: `backend/.env.example` to `backend/.env` and adjust if needed.
   - Install deps and run:
     ```bash
     cd backend
     npm install
     npm run dev
     ```
   - API at http://localhost:5000

2. **Frontend**
   - Copy env: `frontend/.env.example` to `frontend/.env` (points to http://localhost:5000/api).
   - Install deps and run:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - App at http://localhost:5173

## Technical Details

- **Multi-platform downloads** powered by yt-dlp with automatic fallback to ytdl-core for YouTube
- **Platform detection** automatically identifies the source platform (YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit)
- **Smart format selection** with user-agent and referer headers for better compatibility
- JSON analytics path is configurable via `ANALYTICS_STORE` in backend `.env`
- For production, deploy frontend (Vercel/Netlify) and backend (Render/Fly/Railway). Set CORS and `VITE_API_URL` accordingly.

## Recent Updates

✅ **Full multi-platform support enabled** (TikTok, Instagram, Facebook, Twitter/X, Reddit)  
✅ Enhanced yt-dlp integration with social media headers  
✅ Automatic platform detection and validation  
✅ Improved UI with platform badges  
✅ Better error handling for different platforms
