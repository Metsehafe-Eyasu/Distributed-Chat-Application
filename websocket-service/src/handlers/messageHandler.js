const axios = require('axios');

const handleMessage = async (ws, data, user) => {
  try {
    const { recipient, content } = JSON.parse(data);

    // Save the message to the Chat Service
    const response = await axios.post(`${process.env.CHAT_SERVICE_URL}/send`, {
      sender: user.id, // Use authenticated user ID
      recipient,
      content,
    });

    // Broadcast the message back to the sender
    ws.send(JSON.stringify({
      event: 'message',
      data: response.data.data,
    }));
  } catch (err) {
    console.error('Error handling message:', err.message);
    ws.send(JSON.stringify({
      event: 'error',
      message: 'Failed to process message',
    }));
  }
};

module.exports = { handleMessage };
