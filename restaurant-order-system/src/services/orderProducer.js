const kafka = require('../config/kafka');

const producer = kafka.producer();

const orderTopics = {
  NEW_ORDER: 'new-orders',
  ORDER_STATUS: 'order-status-updates',
  DELIVERY_UPDATES: 'delivery-updates'
};

async function initializeProducer() {
  await producer.connect();
  console.log('Kafka Producer connected');
}

async function sendOrderMessage(topic, message) {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
      partitions: 3 // Using multiple partitions for better scalability
    });
  } catch (error) {
    console.error('Error producing message:', error);
    throw error;
  }
}

module.exports = {
  initializeProducer,
  sendOrderMessage,
  orderTopics
};