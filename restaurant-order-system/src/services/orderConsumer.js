const kafka = require('../config/kafka');
const Order = require('../models/Order');
const redisClient = require('../config/redis');

const consumer = kafka.consumer({ groupId: 'order-processing-group' });

async function initializeConsumer() {
  await consumer.connect();
  
  // Subscribe to multiple topics
  await consumer.subscribe({ topics: ['new-orders', 'order-status-updates', 'delivery-updates'] });
  
  await consumer.run({
    partitionsConsumedConcurrently: 3,
    eachMessage: async ({ topic, partition, message }) => {
      const orderData = JSON.parse(message.value.toString());
      
      switch(topic) {
        case 'new-orders':
          await processNewOrder(orderData);
          break;
        case 'order-status-updates':
          await processStatusUpdate(orderData);
          break;
        case 'delivery-updates':
          await processDeliveryUpdate(orderData);
          break;
      }
    },
  });
}

async function processNewOrder(orderData) {
  const order = new Order(orderData);
  await order.save();
  
  // Cache order details in Redis
  await redisClient.setEx(
    `order:${order._id}`,
    3600, // 1 hour expiration
    JSON.stringify(order)
  );
}

async function processStatusUpdate(orderData) {
  const { orderId, status } = orderData;
  await Order.findByIdAndUpdate(orderId, { status });
  
  // Update cache
  await redisClient.setEx(
    `order:${orderId}:status`,
    3600,
    status
  );
}

module.exports = {
  initializeConsumer
};
