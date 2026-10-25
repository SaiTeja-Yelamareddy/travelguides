const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const seedAllData = require('./seed/seedData');

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS for production and development
const configuredClients = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // If CLIENT_URL is set to '*' allow all
    if (process.env.CLIENT_URL === '*') return callback(null, true);

    const isExplicitlyAllowed = configuredClients.includes(origin) || defaultAllowedOrigins.includes(origin);
    const isVercelPreview = /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin);

    if (isExplicitlyAllowed || isVercelPreview) {
      return callback(null, true);
    }

    // In non-strict fallback, allow or reject based on environment
    if (process.env.NODE_ENV === 'production' && configuredClients.length > 0) {
      console.warn(`[CORS Blocked]: Origin ${origin} not in allowed list`);
      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure database connection is active before processing resource requests
app.use(async (req, res, next) => {
  // Allow health checks even if DB is still connecting
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: 'Database service temporarily unavailable. Please verify MONGODB_URI and network access: ' + err.message
    });
  }
});

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Mount routes: support both root paths (/places) and /api prefixed paths (/api/places)
const resourceRoutes = [
  { prefix: '', router: authRoutes },
  { prefix: '/places', router: placeRoutes },
  { prefix: '/hotels', router: hotelRoutes },
  { prefix: '/favorites', router: favoriteRoutes },
  { prefix: '/admin', router: reportRoutes }
];

resourceRoutes.forEach(({ prefix, router }) => {
  app.use(prefix || '/', router);
  app.use(`/api${prefix}`, router);
});

// Production & Serverless Health check endpoint
const healthHandler = (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.status(200).json({
    status: 'healthy',
    application: 'TravelGuide – Tourism Information Portal API',
    environment: process.env.NODE_ENV || 'development',
    database: dbState,
    timestamp: new Date().toISOString()
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to TravelGuide Tourism Information Portal API',
    health: '/api/health'
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Initial Database connection and optional seeding for persistent server environments
if (!process.env.VERCEL) {
  connectDB().then(async () => {
    // Auto-seed if in development or if AUTO_SEED is enabled
    if (process.env.NODE_ENV !== 'production' || process.env.AUTO_SEED === 'true') {
      try {
        await seedAllData();
      } catch (err) {
        console.warn('[Seed Warning]: Could not seed initial data:', err.message);
      }
    }
  }).catch((err) => {
    console.error('[Startup Error]: Could not connect to MongoDB:', err.message);
  });
}

const PORT = process.env.PORT || 5000;

// Only start HTTP listener if not running inside Vercel Serverless Function runtime
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[TravelGuide API Server]: Running on http://localhost:${PORT}`);
  });
}

// Export app for serverless function runtimes (e.g. Vercel) and testing
module.exports = app;
