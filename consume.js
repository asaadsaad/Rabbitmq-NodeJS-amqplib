const amqp = require("amqplib");

const { amqpServer } = require('../config');
const sendMail = require('../handlers/sendMail');

module.exports.connect = async () => {
    const q = 'test_queue';

    try {
        const connection = await amqp.connect(amqpServer)
        const channel = await connection.createChannel();
        await channel.assertQueue(q, { durable: true });

        channel.consume(q, message => {
            let msgJSON;

            try {
                msgJSON = JSON.parse(message.content.toString());
            } catch (e) {
                console.error(e);
            }

            console.info('I received a message!!', msgJSON);

            sendMail(msgJSON);
            // clear message from queue after we handeled the message
            channel.ack(message);

        }, // Turn off auto ack (turn on manual ack)
            { noAck: false })

        console.info("Waiting for messages...")
    }
    catch (ex) {
        console.error(ex)
    }
};

// const q = require('./Q/consume');
// q.connect();