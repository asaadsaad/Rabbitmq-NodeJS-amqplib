const amqp = require("amqplib");

const { amqpServer } = require('../config');

const q = 'test_queue';
let channel = null;

async function connect() {
    try {
        const connection = await amqp.connect(amqpServer)
        channel = await connection.createChannel();
        await channel.assertQueue(q, { durable: true });
    }
    catch (ex) {
        console.error(ex)
    }
}
connect();

const pushToMessageQ = msg => {
    if (!channel) setTimeout(pushToMessageQ(msg), 1000);

    await channel.sendToQueue(q, Buffer.from(JSON.stringify(msg)))
    console.info(`Job sent successfully ${msg}`);
    return { success: true };
};

module.exports = {
    pushToMessageQ
};

// const { pushToMessageQ } = require('../Q/connect');
// pushToMessageQ(msg);