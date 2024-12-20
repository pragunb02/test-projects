const { kafka } = require('./client');
const group = process.argv[2]; // CLI will take group ID

async function init() {
    console.log(`Initializing consumer for group: ${group}...`);
    
    const consumer = kafka.consumer({ groupId: group });

    try {
        console.log('Connecting to Kafka broker...');
        await consumer.connect();
        console.log('Consumer connected successfully.');

        console.log(`Subscribing to topic [rider-updates]...`);
        await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });
        console.log('Subscribed to topic [rider-updates].');

        console.log('Starting message consumption...');
        await consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                // Log each message received, along with partition info
                const messageContent = message.value.toString();
                console.log(`[${group}] Consumed message from topic: ${topic}, partition: ${partition}`);
                console.log(`[${group}] Message content: ${messageContent}`);
                
                // Log heartbeat and pause information if needed
                console.log(`[${group}] Heartbeat received. Partition: ${partition}`);
            },
        });

    } catch (error) {
        console.error(`[${group}] Error during Kafka consumer operation:`, error);
    }
    
    // Optionally disconnect if needed
    // await consumer.disconnect();
}

init();
