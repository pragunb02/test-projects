const express = require('express');
const redisClient = require('./redis/cache');  // Use the updated cache.js

const app = express();
app.use(express.json());

// Define sendStockUpdate function
const sendStockUpdate = async (stockData) => {
    const { stock, price, timestamp } = stockData;
    
    // Store the stock data in Redis (using async/await with promises)
    try {
        await redisClient.set(stock, JSON.stringify({ price, timestamp }));
        console.log(`Stock data for ${stock} updated at ${timestamp}`);
    } catch (err) {
        console.error('Error storing stock data:', err);
    }
};

// POST endpoint to send stock updates
app.post('/api/stock/update', async (req, res) => {
    const { stock, price } = req.body;
    const stockData = { stock, price, timestamp: Date.now() };
    await sendStockUpdate(stockData);  // Call sendStockUpdate and wait for the Redis update
    res.status(200).json({ message: 'Stock update sent' });
});

// GET endpoint to retrieve stock data
app.get('/api/stock/:symbol', async (req, res) => {
    const stockSymbol = req.params.symbol.toUpperCase();
    
    try {
        const data = await redisClient.get(stockSymbol);  // Use async/await for get
        if (data) {
            return res.status(200).json(JSON.parse(data));
        } else {
            return res.status(404).json({ message: 'Stock not found' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Error retrieving data' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
