import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Downloader from './components/Downloader.jsx'
import AnalyticsBar from './components/AnalyticsBar.jsx'
import Footer from './components/Footer.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import Logo from './components/Logo.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import TermsOfService from './components/TermsOfService.jsx'
import BlogIndex from './components/blog/BlogIndex.jsx'
import VideoDownloadingTips from './components/blog/VideoDownloadingTips.jsx'
import BestVideoDownloaders2025 from './components/blog/BestVideoDownloaders2025.jsx'
import HowToDownloadInstagramVideos from './components/blog/HowToDownloadInstagramVideos.jsx'
import YoutubeMp3ConversionGuide from './components/blog/YoutubeMp3ConversionGuide.jsx'
import SocialMediaContentCreation from './components/blog/SocialMediaContentCreation.jsx'
import { api } from './lib/api.js'

function AppContent({ mounted }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const title = 'ViralClipCatch - Download Videos from YouTube, TikTok, Instagram, Facebook Without Watermark'
  const desc = 'Free online video downloader for YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit. Download HD videos without watermark in MP4, MP3 formats. No registration required.'

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="video downloader, youtube downloader, tiktok downloader, instagram downloader, facebook downloader, download videos without watermark, hd video download, mp4 download, mp3 download, social media video downloader" />
        <meta property="og:title" content="ViralClipCatch - Download Videos from Social Media Without Watermark" />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-cover.png" />
        <meta property="og:url" content={`https://viralclipcatch.com${location.pathname}`} />
        <link rel="canonical" href={`https://viralclipcatch.com${location.pathname}`} />
      </Helmet>

      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-neutral-950/70 border-b border-white/20 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            {isHomePage && (
              <a href="#how" className="text-sm opacity-80 hover:opacity-100">How it works</a>
            )}
            <button 
              onClick={() => alert('The mobile app is currently under development. Please check back soon for updates!')}
              className="text-sm bg-primary text-white px-3 py-1 rounded-full hover:bg-opacity-90"
            >
              Download App
            </button>
            <ThemeToggle mounted={mounted} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <Routes>
          <Route path="/" element={
            <>
              <section className="py-10 sm:py-16">
                <div className="text-center mb-8">
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight"><span className="text-primary">Viral</span>ClipCatch</h1>
                  <p className="mt-3 text-base sm:text-lg opacity-80">Paste a link from YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit and more.</p>
                </div>
                <Downloader />
                <AnalyticsBar />
              </section>

              <section id="how" className="py-10 grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl shadow-soft glass">
                  <h3 className="font-semibold mb-2">1. Paste URL</h3>
                  <p className="opacity-80">Copy the video link from your favorite platform and paste it here.</p>
                </div>
                <div className="p-6 rounded-2xl shadow-soft glass">
                  <h3 className="font-semibold mb-2">2. Pick Quality</h3>
                  <p className="opacity-80">Choose from video (144p–4K) or audio-only formats.</p>
                </div>
                <div className="p-6 rounded-2xl shadow-soft glass">
                  <h3 className="font-semibold mb-2">3. Download</h3>
                  <p className="opacity-80">A short ad plays, then your download starts automatically.</p>
                </div>
              </section>
              
              {/* FAQ Section for better SEO */}
              <section className="py-10">
                <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl shadow-soft glass">
                    <h3 className="font-semibold mb-2">Which platforms are supported?</h3>
                    <p className="opacity-80">ViralClipCatch supports YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit, and many other social media platforms.</p>
                  </div>
                  <div className="p-6 rounded-2xl shadow-soft glass">
                    <h3 className="font-semibold mb-2">Is it free to use?</h3>
                    <p className="opacity-80">Yes, ViralClipCatch is completely free to use with no hidden charges or registration required.</p>
                  </div>
                  <div className="p-6 rounded-2xl shadow-soft glass">
                    <h3 className="font-semibold mb-2">Can I download videos without watermark?</h3>
                    <p className="opacity-80">Yes, our advanced technology removes watermarks from most videos while maintaining high quality.</p>
                  </div>
                  <div className="p-6 rounded-2xl shadow-soft glass">
                    <h3 className="font-semibold mb-2">What formats are available?</h3>
                    <p className="opacity-80">Download videos in MP4 format (144p to 4K) or extract audio in MP3 format.</p>
                  </div>
                </div>
              </section>
              
              {/* Features Section for better SEO */}
              <section className="py-10">
                <h2 className="text-2xl font-bold text-center mb-8">Why Choose ViralClipCatch?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl shadow-soft glass">
                    <h3 className="font-semibold mb-2">No Watermark Downloads</h3>
                    <p className="opacity-80">Download clean videos without any watermarks or logos from social media platforms.</p>
                  </div>
                  <div className="p-6 rounded-2xl shadow-soft glass">
                    <h3 className="font-semibold mb-2">Multiple Formats</h3>
                    <p className="opacity-80">Choose from various video qualities (144p-4K) or extract high-quality audio in MP3 format.</p>
                  </div>
                  <div className="p-6 rounded-2xl shadow-soft glass">
                    <h3 className="font-semibold mb-2">Fast Processing</h3>
                    <p className="opacity-80">Our optimized servers ensure quick conversion and download speeds for all video types.</p>
                  </div>
                  <div className="p-6 rounded-2xl shadow-soft glass">
                    <h3 className="font-semibold mb-2">100% Free</h3>
                    <p className="opacity-80">Enjoy unlimited downloads without any subscription fees or hidden costs.</p>
                  </div>
                  <div className="p-6 rounded-2xl shadow-soft glass">
                    <h3 className="font-semibold mb-2">No Registration</h3>
                    <p className="opacity-80">Start downloading immediately without creating an account or providing personal information.</p>
                  </div>
                  <div className="p-6 rounded-2xl shadow-soft glass">
                    <h3 className="font-semibold mb-2">Mobile Friendly</h3>
                    <p className="opacity-80">Works perfectly on all devices including smartphones, tablets, and desktop computers.</p>
                  </div>
                </div>
              </section>
            </>
          } />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/video-downloading-tips" element={<VideoDownloadingTips />} />
          <Route path="/blog/best-video-downloaders-2025" element={<BestVideoDownloaders2025 />} />
          <Route path="/blog/how-to-download-instagram-videos" element={<HowToDownloadInstagramVideos />} />
          <Route path="/blog/youtube-mp3-conversion-guide" element={<YoutubeMp3ConversionGuide />} />
          <Route path="/blog/social-media-content-creation" element={<SocialMediaContentCreation />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { 
    setMounted(true)
    // record visit
    api.post('/analytics/event', { type: 'visit' }).catch(()=>{})
  }, [])

  return (
    <Router>
      <AppContent mounted={mounted} />
    </Router>
  )
}