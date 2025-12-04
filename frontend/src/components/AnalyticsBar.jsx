import { useEffect, useState, useRef } from 'react'
import { api } from '../lib/api.js'
import io from 'socket.io-client'

export default function AnalyticsBar() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const socketRef = useRef(null)
  const sessionIdRef = useRef(null)

  // Generate a unique session ID
  useEffect(() => {
    sessionIdRef.current = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }, [])

  // Fetch initial data
  const fetchSummary = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching analytics from:', `${api.defaults.baseURL}/analytics/summary`)
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
      
      const res = await api.get('/analytics/summary')
      console.log('✅ Analytics fetch successful:', res.data)
      setData(res.data)
      setError(null)
    } catch (err) {
      console.error('💥 Analytics fetch error:', err)
      console.error('📝 Error response:', err?.response)
      console.error('📄 Error response data:', err?.response?.data)
      console.error('🔢 Error status:', err?.response?.status)
      
      const errorMessage = err?.response?.data?.error || 
                          err?.response?.data?.message || 
                          err?.message || 
                          'Failed to load analytics data'
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Add active user
  const addActiveUser = async () => {
    if (!sessionIdRef.current) return
    try {
      await api.post('/analytics/active-user', { sessionId: sessionIdRef.current })
    } catch (err) {
      console.error('Failed to add active user:', err)
    }
  }

  // Add live visitor
  const addLiveVisitor = async () => {
    if (!sessionIdRef.current) return
    try {
      await api.post('/analytics/live-visitor', { sessionId: sessionIdRef.current })
    } catch (err) {
      console.error('Failed to add live visitor:', err)
    }
  }

  // Remove active user
  const removeActiveUser = async () => {
    if (!sessionIdRef.current) return
    try {
      await api.delete(`/analytics/active-user/${sessionIdRef.current}`)
    } catch (err) {
      console.error('Failed to remove active user:', err)
    }
  }

  // Remove live visitor
  const removeLiveVisitor = async () => {
    if (!sessionIdRef.current) return
    try {
      await api.delete(`/analytics/live-visitor/${sessionIdRef.current}`)
    } catch (err) {
      console.error('Failed to remove live visitor:', err)
    }
  }

  // Setup WebSocket connection for real-time updates
  const setupWebSocket = () => {
    // Extract base URL without /api path for WebSocket connection
    const apiUrl = api.defaults.baseURL || 'http://localhost:5000';
    const baseUrl = apiUrl.replace('/api', '');
    
    // Create WebSocket connection
    const socket = io(
      baseUrl,
      {
        transports: ['websocket', 'polling']
      }
    );
    
    socketRef.current = socket;
    
    // Listen for real-time updates
    socket.on('realtimeUpdate', (realtimeData) => {
      setData(prevData => ({
        ...prevData,
        activeUsers: realtimeData.activeUsers,
        liveVisitors: realtimeData.liveVisitors,
        today: {
          ...prevData?.today,
          download: Math.max(prevData?.today?.download || 0, realtimeData.todayDownloads || realtimeData.today?.download || 0)
        }
      }));
    });
    
    // Handle connection errors
    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
    });
    
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
    
    return () => {
      socket.disconnect();
    };
  }

  useEffect(() => {
    fetchSummary()
    addActiveUser()
    addLiveVisitor()
    
    const cleanupWebSocket = setupWebSocket()
    
    // Cleanup on unmount
    return () => {
      cleanupWebSocket()
      removeActiveUser()
      removeLiveVisitor()
    }
  }, [])

  if (loading && !data) {
    return (
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <Stat label="Today's Downloads" value="..." />
        <Stat label="Active Users" value="..." />
        <Stat label="Live Visitors" value="..." />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="mt-6 p-4 rounded-2xl shadow-soft border border-white/40 dark:border-neutral-800 glass text-center text-red-500">
        Failed to load analytics data
      </div>
    )
  }

  return (
    <div className="mt-6 grid sm:grid-cols-3 gap-3">
      <Stat label="Today's Downloads" value={data?.today?.download || 0} />
      <Stat label="Active Users" value={data?.activeUsers || 0} />
      <Stat label="Live Visitors" value={data?.liveVisitors || 0} />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-2xl shadow-soft border border-white/40 dark:border-neutral-800 glass">
      <div className="text-2xl font-extrabold text-primary">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  )
}