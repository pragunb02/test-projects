const { Kafka } = require('kafkajs');

// Kafka client configuration
exports.kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'] // Add more brokers for redundancy if needed
});
