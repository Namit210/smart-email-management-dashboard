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
const { seedDatabase } = require('./services/seedData');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_email_assistant';

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

// API Routes
app.use('/api/accounts', authRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stats', statsRoutes);

// Static client build serving
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

// Database connection & Server start
async function startServer() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected successfully.');

    // Seed realistic prototype dataset
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Smart Email Management Server running on port ${PORT}`);
      console.log(`🌐 Application URL: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('Starting HTTP server in offline fallback mode...');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (Database unavailable)`);
    });
  }
}

startServer();
