import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import AdModal from './ad/AdModal.jsx'

const BTN = 'px-4 py-2 rounded-xl bg-primary text-white hover:opacity-95 shadow-soft disabled:opacity-50'

export default function Downloader() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [type, setType] = useState('video')
  const [itag, setItag] = useState('')
  const [showAd, setShowAd] = useState(false)

  useEffect(() => {
    if (!data) return
    // Auto-select first available format
    if (type === 'video' && data.formats?.length) {
      setItag(String(data.formats[0].itag))
    }
    if (type === 'audio' && data.audio?.length) setItag(String(data.audio[0].itag))
  }, [data, type])

  const onParse = async () => {
    setError('')
    if (!url.trim()) return setError('Please paste a URL')
    setLoading(true)
    try {
      console.log('🔍 Making API call to:', `${api.defaults.baseURL}/parse`)
      console.log('🌐 API Base URL:', api.defaults.baseURL)
      
      // Test connection first
      try {
        console.log('🧪 Testing connection to backend...')
        const healthCheck = await api.get('/health')
        console.log('✅ Health check successful:', healthCheck.data)
      } catch (healthErr) {
        console.error('❌ Health check failed:', healthErr)
        console.error('📝 Health check error response:', healthErr.response?.data || healthErr.message)
        throw new Error(`Cannot connect to the server. ${healthErr.response?.data?.error || healthErr.message || 'Please try again later.'}`)
      }
      
      const res = await api.post('/parse', { url })
      console.log('✅ Parse successful:', res.data)
      setData(res.data)
      setType('video')
    } catch (e) {
      console.error('💥 API Error:', e)
      console.error('📝 Error response:', e?.response)
      console.error('📄 Error response data:', e?.response?.data)
      console.error('🔢 Error status:', e?.response?.status)
      
      const errorMessage = e?.response?.data?.error || 
                          e?.response?.data?.message || 
                          e?.message || 
                          'Failed to parse URL. Please check the URL and try again.'
      
      setData(null)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const onDownload = async () => {
    if (!itag) return
    setError('')
    setShowAd(true)
  }

  const shareSite = async () => {
    const shareData = {
      title: 'ViralClipCatch',
      text: 'Download videos and audio from all major platforms',
      url: window.location.origin
    }
    try {
      if (navigator.share) await navigator.share(shareData)
    } catch {}
  }

  const copy = () => {
    if (!url) return
    navigator.clipboard.writeText(url)
  }

  const paste = async () => {
    try {
      const t = await navigator.clipboard.readText()
      if (t) setUrl(t)
    } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Platform Support Banner */}
      <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-400 dark:border-purple-700">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div className="flex-1">
            <h3 className="font-bold text-purple-900 dark:text-purple-200 mb-1">Multi-Platform Video Downloader</h3>
            <p className="text-sm text-purple-800 dark:text-purple-300 mb-2">
              Download videos from YouTube, TikTok, Instagram, Facebook, Twitter/X, Reddit and more!
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-red-500 text-white">YouTube</span>
              <span className="px-2 py-1 rounded-full bg-black text-white">TikTok</span>
              <span className="px-2 py-1 rounded-full bg-pink-500 text-white">Instagram</span>
              <span className="px-2 py-1 rounded-full bg-blue-600 text-white">Facebook</span>
              <span className="px-2 py-1 rounded-full bg-sky-500 text-white">Twitter/X</span>
              <span className="px-2 py-1 rounded-full bg-orange-600 text-white">Reddit</span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl p-2 sm:p-3 bg-white/70 dark:bg-neutral-900/70 shadow-soft border border-white/40 dark:border-neutral-800 glass">
        <div className="flex flex-col sm:flex-row gap-2">
          <input value={url} onChange={e=>setUrl(e.target.value)} type="url" placeholder="Paste video URL here" className="flex-1 px-4 py-3 rounded-xl outline-none bg-white dark:bg-neutral-900 border border-white/40 dark:border-neutral-800" />
          <div className="flex gap-2">
            <button onClick={paste} className="px-3 py-2 rounded-xl border border-white/40 dark:border-neutral-700">Paste</button>
            <button onClick={copy} className="px-3 py-2 rounded-xl border border-white/40 dark:border-neutral-700">Copy</button>
            <button onClick={onParse} disabled={loading} className={BTN}>{loading ? 'Parsing…' : 'Fetch'}</button>
          </div>
        </div>
        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">⚠️ {error}</p>
          </div>
        )}
      </div>

      {data && (
        <div className="mt-6 rounded-2xl p-4 shadow-soft border border-white/40 dark:border-neutral-800 glass">
          <div className="flex items-center gap-3">
            <img src={data.thumbnails?.[data.thumbnails.length-1]?.url} alt="thumb" className="w-20 h-14 object-cover rounded-xl" />
            <div className="flex-1">
              <div className="font-semibold line-clamp-2">{data.title}</div>
              <div className="text-sm opacity-70">{data.author}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button onClick={()=>setType('video')} className={`px-3 py-1.5 rounded-full border ${type==='video' ? 'bg-primary text-white' : 'border-white/40 dark:border-neutral-700'}`}>Video</button>
            <button onClick={()=>setType('audio')} className={`px-3 py-1.5 rounded-full border ${type==='audio' ? 'bg-primary text-white' : 'border-white/40 dark:border-neutral-700'}`}>Audio</button>
          </div>

          {type==='video' && (
            <>
              {data.platform === 'youtube' && data.formats?.some(f => !f.hasAudio) && (
                <div className="mt-3 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 text-sm">
                  <strong>ℹ️ Note:</strong> Only formats with audio are shown for YouTube videos. Higher quality video-only formats require merging.
                </div>
              )}
              <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.formats?.length > 0 ? (
                  data.formats.map(f=> (
                    <button 
                      key={f.itag} 
                      onClick={()=>setItag(String(f.itag))} 
                      className={`p-3 rounded-xl border text-left ${String(itag)===String(f.itag) ? 'border-primary bg-primary/10' : 'border-white/40 dark:border-neutral-700'}`}>
                      <div className="font-medium">
                        {f.qualityLabel} · {f.container.toUpperCase()}
                      </div>
                      {f.size && <div className="text-xs opacity-70">{(f.size/1024/1024).toFixed(1)} MB</div>}
                    </button>
                  ))
                ) : null}
              </div>
              {data.formats?.length === 0 && (
                <div className="mt-4 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700">
                  <div className="text-center mb-3">
                    <strong className="text-lg">ℹ️ No Video Formats Available</strong>
                  </div>
                  <p className="text-sm mb-3">No downloadable video formats found for this content.</p>
                  <div className="text-sm font-medium mb-2">Your options:</div>
                  <ul className="text-sm list-disc list-inside space-y-1 mb-3">
                    <li>Switch to <strong>Audio tab</strong> to download audio only ({data.audio?.length || 0} formats available)</li>
                    <li>Try a different video URL</li>
                  </ul>
                  {data.audio?.length > 0 && (
                    <button 
                      onClick={() => setType('audio')} 
                      className="w-full px-4 py-2 rounded-xl bg-primary text-white hover:opacity-90">
                      Switch to Audio Download
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {type==='audio' && (
            <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.audio?.map(f=> (
                <button key={f.itag} onClick={()=>setItag(String(f.itag))} className={`p-3 rounded-xl border text-left ${String(itag)===String(f.itag) ? 'border-primary bg-primary/10' : 'border-white/40 dark:border-neutral-700'}`}>
                  <div className="font-medium">{f.container.toUpperCase()} · {f.bitrate}kbps</div>
                  {f.size && <div className="text-xs opacity-70">{(f.size/1024/1024).toFixed(1)} MB</div>}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button onClick={onDownload} className={BTN} disabled={!itag}>Download</button>
            <button onClick={shareSite} className="px-4 py-2 rounded-xl border border-white/40 dark:border-neutral-700">Share</button>
          </div>
        </div>
      )}

      {showAd && (
        <AdModal onClose={()=>setShowAd(false)} onFinish={() => {
          setShowAd(false)
          // Use the API instance instead of constructing URL manually
          const downloadUrl = `${api.defaults.baseURL}/download?url=${encodeURIComponent(url)}&itag=${encodeURIComponent(itag)}&type=${encodeURIComponent(type)}`
          
          // Create a temporary anchor element to trigger download
          const a = document.createElement('a')
          a.href = downloadUrl
          a.download = '' // Triggers download
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }} />
      )}
    </div>
  )
}
