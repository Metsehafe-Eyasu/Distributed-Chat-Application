const Message = require('../models/Message');

// Save a message
const sendMessage = async (req, res) => {
  const { sender, recipient, content } = req.body;

  try {
    const message = new Message({ sender, recipient, content });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  const { user1, user2 } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.json({ data: messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { sendMessage, getMessages };
