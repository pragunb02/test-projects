const kafka = require('kafka-node');
const { KafkaClient, Producer } = kafka;

const client = new KafkaClient({ kafkaHost: 'localhost:9092' }); // Kafka broker
const producer = new Producer(client);

producer.on('ready', () => {
    console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (err) => {
    console.error('Producer error:', err);
});

const sendStockUpdate = (stockData) => {
    const payloads = [
        {
            topic: 'stock-updates', // Kafka topic
            messages: JSON.stringify(stockData),
        },
    ];
    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending message:', err);
        } else {
            console.log('Stock update sent:', data);
        }
    });
};

module.exports = sendStockUpdate;
