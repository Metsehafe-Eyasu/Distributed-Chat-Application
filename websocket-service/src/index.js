const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { handleMessage } = require('./handlers/messageHandler');

dotenv.config();

const PORT = process.env.PORT || 5003;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`WebSocket Service is running on port ${PORT}`);
});

// Map to track connected users and their WebSocket connections
const connectedUsers = new Map();

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  // Extract token from the query parameter in the WebSocket URL
  const token = new URLSearchParams(req.url.split('?')[1]).get('token');

  if (!token) {
    console.log('Authentication failed: No token provided');
    ws.close(4000, 'Unauthorized');
    return;
  }

  let user;
  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, JWT_SECRET);
    user = decoded; // Extract user info from the token
    console.log('Authenticated user:', user);

    // Add user to the connectedUsers map
    connectedUsers.set(user.id, ws);
    console.log(`User connected: ${user.id}`);
  } catch (err) {
    console.log('Authentication failed: Invalid or expired token', err);
    ws.close(4000, 'Unauthorized');
    return;
  }

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const parsedData = JSON.parse(data); // Parse the incoming message as JSON
      const { recipient, content } = parsedData;

      console.log(`Message from ${user.id} to ${recipient}: ${content}`);

      // Check if the recipient is connected
      if (connectedUsers.has(recipient)) {
        const recipientWs = connectedUsers.get(recipient);
        if (recipientWs.readyState === WebSocket.OPEN) {
          // Send the message to the recipient
          recipientWs.send(
            JSON.stringify({
              sender: user.id,
              content,
            })
          );
          console.log(`Message sent to ${recipient}`);
        } else {
          console.log(`Recipient ${recipient} is not open for connection.`);
        }
      } else {
        console.log(`Recipient ${recipient} is not connected.`);
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  // Handle WebSocket disconnection
  ws.on('close', () => {
    // Remove user from connectedUsers map on disconnection
    if (user && user.id) {
      connectedUsers.delete(user.id);
      console.log(`User disconnected: ${user.id}`);
    }
  });
});
