import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [
    {
      sender: { type: String, required: true }, // 'user' or 'ai'
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model('Conversation', conversationSchema);
