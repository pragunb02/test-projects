// server.js
const express = require('express');
const { Kafka } = require('kafkajs');
const Redis = require('redis');
const app = express();

// Redis Setup with Error Handling
const redisClient = Redis.createClient({
    url: 'redis://localhost:6379',
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redisClient.on('error', err => console.error('Redis Client Error', err));
redisClient.connect();

// Kafka Setup
const kafka = new Kafka({
    clientId: 'ecommerce-service',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'inventory-group' });

// Redis Cache Manager - Demonstrating Different Redis Data Structures
class CacheManager {
    // Hash Sets for Product Details
    async setProductDetails(productId, details) {
        await redisClient.hSet(`product:${productId}`, details);
        // Set expiry for cache
        await redisClient.expire(`product:${productId}`, 3600);
    }

    // Sorted Sets for Product Rankings
    async updateProductRanking(productId, score) {
        await redisClient.zAdd('product:rankings', {
            score: score,
            value: productId
        });
    }

    // Lists for Recent Views
    async addRecentlyViewed(userId, productId) {
        const key = `user:${userId}:recent`;
        await redisClient.lPush(key, productId);
        await redisClient.lTrim(key, 0, 9); // Keep only last 10 items
        await redisClient.expire(key, 86400); // 24 hours
    }

    // Sets for User Wishlist
    async addToWishlist(userId, productId) {
        await redisClient.sAdd(`user:${userId}:wishlist`, productId);
    }

    // Pub/Sub for Real-time Notifications
    async publishPriceChange(productId, newPrice) {
        await redisClient.publish('price-changes', 
            JSON.stringify({ productId, newPrice }));
    }
}

// Kafka Event Producer
class EventProducer {
    async sendEvent(topic, event) {
        await producer.connect();
        try {
            await producer.send({
                topic,
                messages: [{ value: JSON.stringify(event) }],
            });
        } finally {
            await producer.disconnect();
        }
    }
}

// Inventory Manager using Redis for Real-time Stock
class InventoryManager {
    async updateStock(productId, quantity) {
        const key = `inventory:${productId}`;
        await redisClient.set(key, quantity);
        
        // If stock is low, send alert via Kafka
        if (quantity < 10) {
            const eventProducer = new EventProducer();
            await eventProducer.sendEvent('inventory-alerts', {
                type: 'LOW_STOCK',
                productId,
                quantity
            });
        }
    }

    async checkStock(productId) {
        const stock = await redisClient.get(`inventory:${productId}`);
        return parseInt(stock) || 0;
    }
}

// Rate Limiter using Redis
async function rateLimiter(req, res, next) {
    const key = `ratelimit:${req.ip}`;
    const limit = 100; // requests
    const window = 3600; // 1 hour in seconds

    try {
        const requests = await redisClient.incr(key);
        if (requests === 1) {
            await redisClient.expire(key, window);
        }

        if (requests > limit) {
            return res.status(429).json({
                error: 'Too many requests'
            });
        }
        next();
    } catch (err) {
        next(err);
    }
}

// API Routes
app.use(express.json());
app.use(rateLimiter);

const cacheManager = new CacheManager();
const inventoryManager = new InventoryManager();

// Product View Tracking
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.headers['user-id'];

    // Cache product views
    await cacheManager.addRecentlyViewed(userId, id);
    
    // Send view event to Kafka
    const eventProducer = new EventProducer();
    await eventProducer.sendEvent('product-views', {
        userId,
        productId: id,
        timestamp: Date.now()
    });

    // Get product details from Redis cache
    const product = await redisClient.hGetAll(`product:${id}`);
    res.json(product);
});

// Purchase Processing
app.post('/purchase', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    // Check stock in Redis
    const currentStock = await inventoryManager.checkStock(productId);
    if (currentStock < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Process purchase (simplified)
    await inventoryManager.updateStock(productId, currentStock - quantity);

    // Send purchase event to Kafka
    const eventProducer = new EventProducer();
    await eventProducer.sendEvent('purchases', {
        userId,
        productId,
        quantity,
        timestamp: Date.now()
    });

    res.json({ success: true });
});

// Start Kafka Consumer for Analytics
async function startConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topics: ['product-views', 'purchases'] });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const event = JSON.parse(message.value.toString());

            switch(topic) {
                case 'product-views':
                    // Update product popularity score in Redis
                    await cacheManager.updateProductRanking(
                        event.productId,
                        await incrementScore(event.productId)
                    );
                    break;
                case 'purchases':
                    // Update purchase analytics
                    await updatePurchaseStats(event);
                    break;
            }
        },
    });
}

async function incrementScore(productId) {
    const key = `product:${productId}:views`;
    const score = await redisClient.incr(key);
    return score;
}

async function updatePurchaseStats(event) {
    const dayKey = new Date().toISOString().split('T')[0];
    await redisClient.hIncrBy(
        `stats:daily:${dayKey}`,
        `product:${event.productId}`,
        event.quantity
    );
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startConsumer().catch(console.error);
});