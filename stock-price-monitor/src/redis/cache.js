const { createClient } = require('@redis/client');  // Import the new Redis client

// Create a new Redis client
const client = createClient({
    url: 'redis://localhost:6379'  // Adjust the URL if your Redis container is different
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

// Connect to Redis explicitly
client.connect();

module.exports = client;
