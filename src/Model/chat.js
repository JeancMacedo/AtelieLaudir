const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  sentAt: { type: Date, default: Date.now }
}, { _id: false });

const ChatSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  messages: { type: [MessageSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
