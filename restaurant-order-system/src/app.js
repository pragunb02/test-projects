// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { initializeProducer } = require('./services/orderProducer');
const { initializeConsumer } = require('./services/orderConsumer');
const orderRoutes = require('./routes/orderRoutes');
const Redis = require('redis');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const mongoStatus = mongoose.connection.readyState === 1;
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: mongoStatus ? 'connected' : 'disconnected',
        server: 'running'
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', error: error.message });
  }
});

// Routes
app.use('/api', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date().toISOString()
    }
  });
});

// Find available port function
async function findAvailablePort(startPort) {
  const net = require('net');
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });

    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    });
  });
}

// MongoDB connection with retry
async function connectToMongoDB() {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-system');
      console.log('✓ Connected to MongoDB');
      return true;
    } catch (error) {
      retries++;
      console.log(`MongoDB connection attempt ${retries}/${maxRetries} failed:`, error.message);
      if (retries === maxRetries) {
        throw new Error('Failed to connect to MongoDB after multiple attempts');
      }
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Redis connection
async function connectToRedis() {
  const redis = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  redis.on('error', (err) => console.error('Redis Client Error:', err));
  
  await redis.connect();
  console.log('✓ Connected to Redis');
  return redis;
}

// Graceful shutdown handler
async function gracefulShutdown(server) {
  console.log('\nStarting graceful shutdown...');
  
  // Close server first
  server.close(() => {
    console.log('✓ Express server closed');
  });

  try {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('✓ MongoDB connection closed');

    // Close Redis connection if it exists
    if (global.redisClient) {
      await global.redisClient.quit();
      console.log('✓ Redis connection closed');
    }

    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Main server startup function
async function startServer() {
  try {
    console.log('\nStarting restaurant order management system...\n');

    // Connect to MongoDB
    await connectToMongoDB();

    // Connect to Redis
    global.redisClient = await connectToRedis();

    // Find available port
    const PORT = await findAvailablePort(process.env.PORT || 3000);
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`\n✓ Server is running on http://localhost:${PORT}`);
      console.log('\nAvailable endpoints:');
      console.log(`- GET  http://localhost:${PORT}/health`);
      console.log(`- POST http://localhost:${PORT}/api/orders`);
      console.log(`- GET  http://localhost:${PORT}/api/orders/:orderId/status`);
    });

    // Initialize Kafka services
    try {
      await initializeProducer();
      console.log('✓ Kafka producer initialized');
      
      await initializeConsumer();
      console.log('✓ Kafka consumer initialized');
    } catch (error) {
      console.error('Failed to initialize Kafka services:', error);
      // Don't exit - the app can still function without Kafka, just with reduced functionality
    }

    // Setup graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown(server));
    process.on('SIGINT', () => gracefulShutdown(server));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      gracefulShutdown(server);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown(server);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Create test data if in development mode
async function createTestData() {
  if (process.env.NODE_ENV === 'development') {
    try {
      // You could add code here to create test restaurants, orders, etc.
      console.log('✓ Test data created successfully');
    } catch (error) {
      console.error('Failed to create test data:', error);
    }
  }
}

// Start the server only if this file is run directly (not required as a module)
if (require.main === module) {
  startServer()
    .then(() => createTestData())
    .catch(console.error);
}

module.exports = { app, startServer };