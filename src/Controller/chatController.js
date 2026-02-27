const Chat = require('../Model/chat');

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(msg => msg && typeof msg === 'object')
    .map(msg => ({
      sender: String(msg.sender || '').trim(),
      content: String(msg.content || '').trim(),
      sentAt: msg.sentAt ? new Date(msg.sentAt) : undefined
    }))
    .filter(msg => msg.sender && msg.content)
    .map(msg => ({
      sender: msg.sender,
      content: msg.content,
      sentAt: msg.sentAt instanceof Date && !Number.isNaN(msg.sentAt.getTime()) ? msg.sentAt : undefined
    }));
}

exports.createChat = async (req, res) => {
  try {
    const { title, messages } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title required' });
    }
    const chat = await Chat.create({
      title: String(title).trim(),
      messages: normalizeMessages(messages)
    });
    res.status(201).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Not found' });
    res.json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listChats = async (req, res) => {
  try {
    const chats = await Chat.find({}).sort({ updatedAt: -1 });
    const data = chats.map(chat => {
      const messages = chat.messages || [];
      const last = messages[messages.length - 1];
      return {
        _id: chat._id,
        title: chat.title,
        updatedAt: chat.updatedAt,
        messageCount: messages.length,
        lastMessage: last ? { sender: last.sender, content: last.content, sentAt: last.sentAt } : null
      };
    });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
