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

async function publishMessage(message) {
  const { channel } = await connectRabbitMQ();
  channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify(message)));
  console.log(`Published message event: ${JSON.stringify(message)}`);
}

module.exports = {
  publishMessage
};
