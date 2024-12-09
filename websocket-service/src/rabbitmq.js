// src/rabbitmq.js
const amqp = require('amqplib');

let channel = null;
let connection = null;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const EXCHANGE_NAME = 'chat_exchange';

async function connectRabbitMQ() {
  if (connection && channel) return { connection, channel };
  
  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });

  return { connection, channel };
}

async function subscribeMessages(onMessage) {
  const { channel } = await connectRabbitMQ();
  const { queue } = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(queue, EXCHANGE_NAME, '');
  channel.consume(queue, (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      onMessage(content);
      channel.ack(msg);
    }
  });
}

module.exports = {
  subscribeMessages
};
