// src/controllers/chatController.js
const Message = require('../models/Message');
const { publishMessage } = require('../rabbitmq');

async function sendMessage(req, res) {
  try {
    const { sender, recipient, content } = req.body;
    const message = new Message({ sender, recipient, content });
    await message.save();

    // Publish an event for the new message
    await publishMessage({ type: 'new_message', data: message });

    return res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (err) {
    console.error('Error sending message:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getMessages(req, res) {
  try {
    const { user1, user2 } = req.query;
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.json({ data: messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { sendMessage, getMessages };
