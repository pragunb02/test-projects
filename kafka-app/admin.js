const { kafka } = require('./client');

async function init() {
    const admin = kafka.admin();
    
    try {
        console.log("Admin Connecting...");
        await admin.connect();
        console.log("Admin Connection Success...");

        console.log('Creating Topic [rider-updates]');
        await admin.createTopics({
            topics: [
                {
                    topic: 'rider-updates',
                    numPartitions: 2
                },
            ],
        });
        console.log('Created Topic [rider-updates] Success');

    } catch (error) {
        console.error("Error during topic creation:", error);
    } finally {
        console.log("Disconnecting admin...");
        await admin.disconnect();
    }
}

init();
