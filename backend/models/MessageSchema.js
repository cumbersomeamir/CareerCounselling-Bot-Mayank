import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  thread_id: {
    type: String,
    required: true,
  },
  message_id: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  ai: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
