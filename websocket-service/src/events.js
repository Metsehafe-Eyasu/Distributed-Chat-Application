// src/events.js
const WebSocket = require('ws');
const { resolveUserId } = require('./userUtils');

async function handleNewMessageEvent(event, connectedUsers) {
  if (event.type === 'new_message') {
    const { data } = event; 
    const recipientUsername = data.recipient;

    try {
      const recipientId = await resolveUserId(recipientUsername);
      if (!recipientId) {
        console.log(`No user found for username: ${recipientUsername}`);
        return;
      }

      if (connectedUsers.has(recipientId)) {
        const recipientWs = connectedUsers.get(recipientId);
        if (recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(JSON.stringify({
            sender: data.sender,
            content: data.content,
            timestamp: data.timestamp
          }));
          console.log(`Delivered message to ${recipientId}`);
        } else {
          console.log(`User ${recipientId} connection not open`);
        }
      } else {
        console.log(`Recipient ${recipientId} not connected`);
      }
    } catch (err) {
      console.error(`Error resolving user ID for ${recipientUsername}:`, err.message);
    }
  }
}

module.exports = { handleNewMessageEvent };
