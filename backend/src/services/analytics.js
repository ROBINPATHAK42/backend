import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storePath = process.env.ANALYTICS_STORE || path.join(__dirname, '../../data/analytics.json');

// In-memory storage for real-time data
let realtimeData = {
  activeUsers: new Map(), // Store socket IDs or session IDs with timestamps
  liveVisitors: new Map(),
  todayDownloads: 0,
  lastUpdated: Date.now()
};

// Cleanup intervals (in milliseconds)
const ACTIVE_USER_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const LIVE_VISITOR_TIMEOUT = 2 * 60 * 1000; // 2 minutes

function readStore() {
  try {
    const s = fs.readFileSync(storePath, 'utf-8');
    return JSON.parse(s);
  } catch {
    return { totals: { download: 0, visit: 0 }, byDate: {} };
  }
}

function writeStore(data) {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
}

// Function to clean up expired sessions
function cleanupExpiredSessions() {
  const now = Date.now();
  
  // Clean up expired active users
  for (const [id, timestamp] of realtimeData.activeUsers.entries()) {
    if (now - timestamp > ACTIVE_USER_TIMEOUT) {
      realtimeData.activeUsers.delete(id);
    }
  }
  
  // Clean up expired live visitors
  for (const [id, timestamp] of realtimeData.liveVisitors.entries()) {
    if (now - timestamp > LIVE_VISITOR_TIMEOUT) {
      realtimeData.liveVisitors.delete(id);
    }
  }
}

// Add active user
export function addActiveUser(sessionId) {
  cleanupExpiredSessions();
  realtimeData.activeUsers.set(sessionId, Date.now());
  return getRealtimeSummary();
}

// Remove active user
export function removeActiveUser(sessionId) {
  realtimeData.activeUsers.delete(sessionId);
  return getRealtimeSummary();
}

// Add live visitor
export function addLiveVisitor(sessionId) {
  cleanupExpiredSessions();
  realtimeData.liveVisitors.set(sessionId, Date.now());
  return getRealtimeSummary();
}

// Remove live visitor
export function removeLiveVisitor(sessionId) {
  realtimeData.liveVisitors.delete(sessionId);
  return getRealtimeSummary();
}

// Increment today's downloads
export function incrementTodayDownloads() {
  realtimeData.todayDownloads++;
  realtimeData.lastUpdated = Date.now();
  return getRealtimeSummary();
}

export function recordEvent(type) {
  const data = readStore();
  data.totals[type] = (data.totals[type] || 0) + 1;
  const day = dayjs().format('YYYY-MM-DD');
  data.byDate[day] = data.byDate[day] || { download: 0, visit: 0 };
  data.byDate[day][type] = (data.byDate[day][type] || 0) + 1;
  writeStore(data);
  
  // Update real-time data
  if (type === 'download') {
    incrementTodayDownloads();
  }
  
  return getSummary();
}

export function getRealtimeSummary() {
  cleanupExpiredSessions();
  
  return {
    activeUsers: realtimeData.activeUsers.size,
    liveVisitors: realtimeData.liveVisitors.size,
    todayDownloads: realtimeData.todayDownloads,
    lastUpdated: realtimeData.lastUpdated
  };
}

export function getSummary() {
  const data = readStore();
  const day = dayjs().format('YYYY-MM-DD');
  const today = data.byDate[day] || { download: 0, visit: 0 };
  
  // Get real-time data
  const realtime = getRealtimeSummary();
  
  return {
    totals: data.totals,
    today: {
      download: Math.max(today.download, realtime.todayDownloads),
      visit: today.visit
    },
    activeUsers: realtime.activeUsers,
    liveVisitors: realtime.liveVisitors
  };
}