const { kafka } = require('./client');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function init() {
    const producer = kafka.producer();

    try {
        console.log('Connecting Producer...');
        await producer.connect();
        console.log('Connected Producer Successfully');

        rl.setPrompt(">");
        rl.prompt();

        rl.on("line", async function (line) {
            const [rider, location] = line.split(" ");

            // Ensure both rider and location are provided
            if (!rider || !location) {
                console.log('Please provide both rider and location.');
                rl.prompt();
                return;
            }

            // Determine partition based on location
            const partition = location.toLowerCase() === "north" ? 0 : 1;
            console.log(`Preparing to send message to partition ${partition}`);

            try {
                await producer.send({
                    topic: 'rider-updates',
                    messages: [
                        {
                            partition: partition,
                            key: 'location-update',
                            value: JSON.stringify({ name: rider, loc: location }),
                        },
                    ],
                });
                console.log(`Message sent for rider: ${rider}, location: ${location} to partition: ${partition}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }
            rl.prompt();
        }).on("close", async () => {
            console.log('Closing producer...');
            await producer.disconnect();
            console.log('Producer disconnected.');
        });

    } catch (error) {
        console.error('Error connecting to producer:', error);
    }
}

init();
