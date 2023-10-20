import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Content is required'],
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: [true, 'Chat Id is required'],
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model('Message', messageSchema);
export { messageModel };
