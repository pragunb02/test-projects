// src/scripts/createTopics.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'restaurant-order-app-admin',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

async function createTopics() {
  const admin = kafka.admin();
  
  try {
    console.log('Connecting to Kafka...');
    await admin.connect();
    console.log('Connected! Creating topics...');
    
    await admin.createTopics({
      topics: [
        { 
          topic: 'new-orders',
          numPartitions: 3,
          replicationFactor: 1
        },
        { 
          topic: 'order-status-updates',
          numPartitions: 3,
          replicationFactor: 1
        },
        { 
          topic: 'delivery-updates',
          numPartitions: 3,
          replicationFactor: 1
        }
      ]
    });
    
    console.log('Topics created successfully');
    
    // List all topics to verify
    const topics = await admin.listTopics();
    console.log('Available topics:', topics);
    
  } catch (error) {
    console.error('Error creating topics:', error);
  } finally {
    await admin.disconnect();
    process.exit(0);
  }
}

// Execute the function
createTopics().catch(console.error);