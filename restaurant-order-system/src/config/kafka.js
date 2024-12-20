const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'restaurant-order-app',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  retry: {
    initialRetryTime: 100,
    retries: 8
  },
  logLevel: logLevel.ERROR
});