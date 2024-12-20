const kafka = require('kafka-node');
const redisClient = require('../redis/cache');

const { KafkaClient, Consumer } = kafka;

const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new Consumer(client, [{ topic: 'stock-updates' }], {
    autoCommit: true,
});

consumer.on('message', async (message) => {
    const stockData = JSON.parse(message.value);
    const { stock, price } = stockData;

    console.log('Received stock update:', stockData);

    // Store stock data in Redis
    await redisClient.set(stock, JSON.stringify(stockData));
    console.log(`Stock ${stock} cached in Redis`);
});

consumer.on('error', (err) => {
    console.error('Consumer error:', err);
});

module.exports = consumer;
