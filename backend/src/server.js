import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDirSync } from 'fs-extra';
import apiRouter from './routes/api.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getRealtimeSummary } from './services/analytics.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS with explicit origins and credentials
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'https://viralclipcatch.netlify.app'];

console.log('CORS Origins configured:', corsOrigins);

const corsOptions = {
  origin: corsOrigins,
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

const app = express();
const server = createServer(app);

// Apply CORS middleware before defining routes
app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Data dir
ensureDirSync(path.join(__dirname, '../data'));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send initial real-time data
  socket.emit('realtimeUpdate', getRealtimeSummary());
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Broadcast real-time updates every 5 seconds
setInterval(() => {
  const realtimeData = getRealtimeSummary();
  io.emit('realtimeUpdate', realtimeData);
}, 5000);

app.get('/api/health', (req, res) => {
  // Add CORS headers explicitly
  const origin = req.get('Origin');
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.json({ status: 'ok', name: 'ViralClipCatch API', time: new Date().toISOString() });
});
  res.json({ status: 'ok', name: 'ViralClipCatch API', time: new Date().toISOString() });
});

// Add root route for basic service verification
app.get('/', (_req, res) => {
  res.json({ 
    message: 'ViralClipCatch API is running', 
    status: 'ok', 
    endpoints: {
      health: '/api/health',
      parse: '/api/parse',
      download: '/api/download',
      analytics: '/api/analytics/summary'
    }
  });
});

app.use('/api', apiRouter);

app.use((err, req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error('Error details:', err);
  console.error('Request body:', req.body);
  console.error('Request headers:', req.headers);
  
  // Handle JSON parsing errors specifically
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err.message);
    return res.status(400).json({ 
      error: 'Bad Request', 
      details: 'Invalid JSON in request body: ' + err.message 
    });
  }
  
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

server.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`✅ API SERVER STARTED SUCCESSFULLY`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🕐 Server started at: ${new Date().toISOString()}`);
  console.log(`📍 Access URLs:`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}`);
  console.log(`🔧 Environment:`);
  console.log(`   PORT: ${PORT}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`   CORS Origins: ${corsOrigins.join(', ')}`);
  console.log('========================================');
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  console.error('Stack:', err.stack);
});

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.error('Stack trace:', err.stack);
  // Don't exit in production, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  console.log('Test CORS endpoint called');
  console.log('Origin header:', req.get(''Origin''));
  
  // Always set CORS headers
  res.header(''Access-Control-Allow-Origin'', req.get(''Origin'') || ''*'');
  res.header(''Access-Control-Allow-Credentials'', ''true'');
  res.header(''Access-Control-Allow-Methods'', ''GET,PUT,POST,DELETE,OPTIONS'');
  res.header(''Access-Control-Allow-Headers'', ''Content-Type, Authorization, X-Requested-With'');
  
  res.json({ 
    status: ''ok'', 
    message: ''CORS test endpoint'', 
    origin: req.get(''Origin''),
    headers: req.headers
  });
});
