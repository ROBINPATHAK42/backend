import { useEffect, useState, useRef } from 'react'

export default function AdModal({ onFinish, onClose }) {
  const [t, setT] = useState(30)
  const [canSkip, setCanSkip] = useState(false)
  const [adStartTime, setAdStartTime] = useState(null)
  const videoRef = useRef(null)
  
  useEffect(() => {
    // Set ad start time
    setAdStartTime(Date.now())
    
    // Play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err)
      })
    }

    const id = setInterval(() => {
      setT(s => {
        if (s <= 1) {
          return 0
        }
        // Allow skip after 5 seconds
        if (s === 25) {
          setCanSkip(true)
        }
        return s - 1
      })
    }, 1000)
    
    return () => clearInterval(id)
  }, [])
  
  useEffect(() => {
    if (t <= 0) {
      onFinish()
    }
  }, [t, onFinish])

  const handleSkip = () => {
    if (canSkip) {
      onFinish()
    }
  }

  // Calculate ad duration and remaining time
  const adDuration = 30
  const remainingTime = t
  const elapsedTime = adDuration - remainingTime
  
  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Video Ad Container - Full Screen */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
        {/* Video Player */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          muted={false}
          controls={false}
          onEnded={onFinish}
        >
          {/* Replace with your actual video ad URL */}
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Top Bar - Ad Info */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold">AD</span>
              <span className="text-sm font-medium">Advertisement</span>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Bottom Bar - Timer and Skip Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center justify-between">
            {/* Timer with detailed info */}
            <div className="text-white">
              <div className="text-sm opacity-80">Your download will start in</div>
              <div className="text-4xl font-bold">{t}s</div>
              <div className="text-xs mt-1 opacity-70">
                Ad time: {formatTime(elapsedTime)} / {formatTime(adDuration)} | 
                Remaining: {formatTime(remainingTime)}
              </div>
            </div>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              disabled={!canSkip}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                canSkip
                  ? 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              {canSkip ? 'Skip Ad →' : `Skip in ${t - 25 > 0 ? t - 25 : 0}s`}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-linear"
              style={{ width: `${((30 - t) / 30) * 100}%` }}
            />
          </div>
          
          {/* Additional Ad Info */}
          <div className="mt-2 flex justify-between text-xs text-white/70">
            <span>Ad {Math.round(((30 - t) / 30) * 100)}% complete</span>
            <span>{remainingTime} seconds remaining</span>
          </div>
        </div>

        {/* Fallback if video fails to load */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white opacity-0 peer-[video:error]:opacity-100">
            <div className="text-6xl mb-4">📺</div>
            <div className="text-xl">Loading advertisement...</div>
          </div>
        </div>
      </div>
    </div>
  )
}