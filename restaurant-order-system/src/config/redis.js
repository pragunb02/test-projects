const Redis = require('redis');

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect().catch(console.error);

module.exports = redisClient;
