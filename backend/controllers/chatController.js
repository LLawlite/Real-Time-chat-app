import chatModel from '../models/chatModel.js';
import { userModel } from '../models/userModel.js';

export const accessChat = async (req, res) => {
  const { userId } = req.body;
  //   console.log(req.user.userId);

  if (!userId) {
    return res.status(400).send({
      message: 'UserId param not sent with the request',
    });
  }
  var isChat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user.userId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await userModel.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'fname pic email',
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]).status(200);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user.userId, userId],
    };

    try {
      const createdChat = await chatModel.create(chatData);

      const Fullchat = await chatModel
        .findOne({ _id: createdChat._id })
        .populate('users', '-password');
      return res.status(200).send(Fullchat);
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  res.sendStatus(200);
};

export const fetchChats = async (req, res) => {
  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: req.user.userId } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        });

        res.status(200).send(results);
      });
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      message: error.message,
    });
  }
};
