export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/30 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-5 gap-6">
        <div>
          <div className="font-semibold mb-2">About</div>
          <p className="text-sm opacity-80">ViralClipCatch helps you download videos and audio from top social platforms. Free, fast, and secure.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Legal</div>
          <ul className="text-sm space-y-1 opacity-90">
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Resources</div>
          <ul className="text-sm space-y-1 opacity-90">
            <li><a href="/blog" className="hover:underline">Blog</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Download App</div>
          <ul className="text-sm space-y-1 opacity-90">
            <li>
              <button 
                onClick={() => alert('The mobile app is currently under development. Please check back soon for updates!')}
                className="hover:underline text-left"
              >
                Android APK
              </button>
            </li>
          </ul>
          <p className="text-xs mt-2 opacity-80">
           ViralClipCatch app is one of the best all in one downloader available online to Download video from social media like facebook, tiktok, instagram, youtube, twitter  without a watermark.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2">Share</div>
          <ul className="text-sm space-y-1 opacity-90">
            <li><a href="https://facebook.com/sharer/sharer.php?u=https://viralclipcatch.com" target="_blank" rel="noreferrer" className="hover:underline">Facebook</a></li>
            <li><a href="https://twitter.com/intent/tweet?text=Try ViralClipCatch&url=https://viralclipcatch.com" target="_blank" rel="noreferrer" className="hover:underline">Twitter/X</a></li>
            <li><a href="https://api.whatsapp.com/send?text=Try ViralClipCatch – https://viralclipcatch.com" target="_blank" rel="noreferrer" className="hover:underline">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs opacity-70 pb-8">© {new Date().getFullYear()} ViralClipCatch.com. All rights reserved.</div>
    </footer>
  )
}