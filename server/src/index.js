const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();
if (!process.env.GEMINI_API_KEY) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const authRoutes = require('./routes/auth.routes');
const emailRoutes = require('./routes/email.routes');
const aiRoutes = require('./routes/ai.routes');
const statsRoutes = require('./routes/stats.routes');
const { router: userAuthRoutes, seedDefaultAssistant } = require('./routes/userAuth.routes');
const { seedDatabase } = require('./services/seedData');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_email_assistant';

// Database connection helper (globally cached across Vercel serverless invocations & standalone)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 5, // Prevents serverless lambdas from exhausting Atlas connection limits
      serverSelectionTimeoutMS: 15000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongooseInstance) => {
      console.log('✅ MongoDB connected successfully.');
      await seedDatabase();
      await seedDefaultAssistant();
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

// Middleware: ensure database is connected for API requests (crucial for Vercel serverless)
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await connectDB();
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
    }
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'Personal Assistant AI Email Dashboard Backend',
    version: '1.0.0',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Authentication middleware to scope requests to active assistant user
app.use('/api', authMiddleware);

// API Routes
app.use('/api/auth', userAuthRoutes);
app.use('/api/accounts', authRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stats', statsRoutes);

// Static client build serving (for standalone deployment)
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start standalone HTTP server only when run directly (e.g. `node server/src/index.js` or `npm start`)
if (require.main === module) {
  connectDB().catch(err => {
    console.warn('⚠️ Starting HTTP server in offline fallback mode:', err.message);
  }).finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Smart Email Management Server running on port ${PORT}`);
      console.log(`🌐 Application URL: http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
