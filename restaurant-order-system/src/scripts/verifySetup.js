// src/scripts/verifySetup.js
const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const Redis = require('redis');
require('dotenv').config();

async function verifyKafka() {
  const kafka = new Kafka({
    clientId: 'setup-verification',
    brokers: ['localhost:9092']
  });
  
  const admin = kafka.admin();
  
  try {
    console.log('Verifying Kafka connection...');
    await admin.connect();
    const topics = await admin.listTopics();
    console.log('✓ Kafka is running');
    console.log('Available topics:', topics);
    await admin.disconnect();
    return true;
  } catch (error) {
    console.error('✗ Kafka verification failed:', error.message);
    return false;
  }
}

async function verifyMongoDB() {
  try {
    console.log('Verifying MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-system');
    console.log('✓ MongoDB is running');
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('✗ MongoDB verification failed:', error.message);
    return false;
  }
}

async function verifyRedis() {
  const redis = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  try {
    console.log('Verifying Redis connection...');
    await redis.connect();
    await redis.ping();
    console.log('✓ Redis is running');
    await redis.disconnect();
    return true;
  } catch (error) {
    console.error('✗ Redis verification failed:', error.message);
    return false;
  }
}

async function verifySetup() {
  console.log('Starting system verification...\n');
  
  const results = await Promise.all([
    verifyKafka(),
    verifyMongoDB(),
    verifyRedis()
  ]);
  
  const allServicesRunning = results.every(result => result === true);
  
  console.log('\nVerification summary:');
  if (allServicesRunning) {
    console.log('✓ All services are running correctly');
  } else {
    console.log('✗ Some services failed verification');
  }
  
  process.exit(allServicesRunning ? 0 : 1);
}

verifySetup().catch(console.error);