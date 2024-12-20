const { sendOrderMessage, orderTopics } = require('../services/orderProducer');
const redisClient = require('../config/redis');
const Order = require('../models/Order');

async function createOrder(req, res) {
  try {
    const orderData = req.body;
    
    // Send to Kafka
    await sendOrderMessage(orderTopics.NEW_ORDER, orderData);
    
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    
    // Try to get from Redis first
    const cachedStatus = await redisClient.get(`order:${orderId}:status`);
    if (cachedStatus) {
      return res.json({ status: cachedStatus });
    }
    
    // If not in cache, get from database
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Cache the result
    await redisClient.setEx(`order:${orderId}:status`, 3600, order.status);
    
    res.json({ status: order.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createOrder,
  getOrderStatus
};
