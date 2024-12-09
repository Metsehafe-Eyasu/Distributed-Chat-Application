// src/index.js
require('dotenv').config();
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { subscribeMessages } = require('./rabbitmq');
const { handleNewMessageEvent } = require('./events');

const PORT = process.env.PORT || 5003;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Map: userId -> WebSocket
const connectedUsers = new Map();

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`WebSocket Service is running on port ${PORT}`);
});

wss.on('connection', (ws, req) => {
  const token = new URLSearchParams(req.url.split('?')[1]).get('token');
  if (!token) {
    ws.close(4000, 'No token provided');
    return;
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
    // user should contain { id, username, ... } based on your Auth Service’s token signing.
    connectedUsers.set(user.id, ws);
    console.log(`User connected: ${user.id}`);
  } catch (err) {
    ws.close(4000, 'Invalid token');
    return;
  }

  ws.on('close', () => {
    connectedUsers.delete(user.id);
    console.log(`User disconnected: ${user.id}`);
  });
});

// Subscribe to RabbitMQ `new_message` events
subscribeMessages((event) => handleNewMessageEvent(event, connectedUsers));
