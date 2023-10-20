import { messageModel } from '../models/messageModel.js';
import { userModel } from '../models/userModel.js';
import chatModel from '../models/chatModel.js';
export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!chatId || !content) {
    return req.status(400).send({ message: 'All fields are required' });
  }
  var newMessage = {
    sender: req.user.userId,
    content: content,
    chat: chatId,
  };
  try {
    var message = await messageModel.create(newMessage);

    message = await message.populate('sender', 'fname pic');
    message = await message.populate('chat');
    message = await userModel.populate(message, {
      path: 'chat.users',
      select: 'fname pic email',
    });

    await chatModel.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    return res.status(201).json(message);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const allMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ chat: req.params.chatId })
      .populate('sender', 'fname pic email')
      .populate('chat');
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
