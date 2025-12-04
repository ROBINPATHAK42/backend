import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function BlogIndex() {
  const blogPosts = [
    {
      id: 'video-downloading-tips',
      title: 'Video Downloading Tips: How to Download Videos Without Watermark',
      excerpt: 'Learn the best tips and tricks for downloading videos from social media platforms without watermarks.',
      date: 'November 23, 2025',
      readTime: '5 min read'
    },
    {
      id: 'best-video-downloaders-2025',
      title: 'Top 10 Best Video Downloaders of 2025',
      excerpt: 'Discover the best video downloaders of 2025. Compare features, pros, and cons of top tools including ViralClipCatch, YouTube-DL, and more.',
      date: 'November 28, 2025',
      readTime: '8 min read'
    },
    {
      id: 'how-to-download-instagram-videos',
      title: 'How to Download Instagram Videos in 2025',
      excerpt: 'Learn how to download Instagram videos, Reels, and Stories in 2025. Step-by-step guide using ViralClipCatch and other methods.',
      date: 'November 28, 2025',
      readTime: '6 min read'
    },
    {
      id: 'youtube-mp3-conversion-guide',
      title: 'Ultimate Guide to YouTube to MP3 Conversion in 2025',
      excerpt: 'Complete guide to converting YouTube videos to MP3 in 2025. Learn the best methods, tools, and tips for extracting high-quality audio.',
      date: 'November 28, 2025',
      readTime: '7 min read'
    },
    {
      id: 'social-media-content-creation',
      title: 'Social Media Content Creation Tips for 2025',
      excerpt: 'Master social media content creation in 2025 with these expert tips. Learn strategies for YouTube, TikTok, Instagram, and more.',
      date: 'November 28, 2025',
      readTime: '9 min read'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Blog - ViralClipCatch | Video Downloading Tips & Guides</title>
        <meta name="description" content="Learn how to download videos from YouTube, TikTok, Instagram, Facebook and more with our expert guides and tutorials." />
        <meta name="keywords" content="video downloading blog, youtube download guide, tiktok video tips, instagram reel download, facebook video download guide" />
        <link rel="canonical" href="https://viralclipcatch.com/blog" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">ViralClipCatch Blog</h1>
        <p className="mb-8 opacity-80">Expert tips, guides, and tutorials for downloading videos from social media platforms.</p>
        
        <div className="grid gap-8">
          {blogPosts.map(post => (
            <article key={post.id} className="p-6 rounded-2xl shadow-soft glass">
              <h2 className="text-2xl font-bold mb-2">
                <Link to={`/blog/${post.id}`} className="hover:text-primary">
                  {post.title}
                </Link>
              </h2>
              <div className="flex items-center text-sm opacity-70 mb-4">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
              <p className="mb-4 opacity-90">{post.excerpt}</p>
              <Link 
                to={`/blog/${post.id}`} 
                className="inline-block text-primary hover:underline font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
        
        <div className="mt-12 p-6 rounded-2xl shadow-soft glass">
          <h3 className="font-semibold mb-2">About ViralClipCatch</h3>
          <p className="mb-4">
            ViralClipCatch is the best all-in-one downloader available online to download videos from social media 
            platforms like Facebook, TikTok, Instagram, YouTube without watermarks. Our service is free, fast, 
            and works on all devices.
          </p>
          <a href="/" className="inline-block bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90">
            Try Our Downloader
          </a>
        </div>
      </div>
    </>
  );
}