import chatModel from '../models/chatModel.js';

export const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({
      success: true,
      message: 'please fill all the fields',
    });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send({
      success: false,
      message: 'More than 2 users are required to form a group chat',
    });
  }

  users.push(req.user.userId);
  console.log(users);

  try {
    const groupChat = await chatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.userId,
    });
    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const renameGroup = async (req, res) => {
  const { chatId, userId, chatName } = req.body;

  // check if the requester is admin
  const chat = await chatModel.findById(chatId);
  const groupAdminId = chat.groupAdmin._id;
  // console.log(chat);
  // to string because to grouAdminID is in form of new Object()
  if (groupAdminId.toString() !== req.user.userId) {
    return res.status(401).send({
      message: 'Only admin can rename',
    });
  }

  const updatedChat = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    return res.status(404).send({
      success: false,
      message: 'Chat not found',
    });
  } else {
    res.status(200).json(updatedChat);
  }
};

export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin
  const chat = await chatModel.findById(chatId);
  const groupAdminId = chat.groupAdmin._id;
  // console.log(chat);
  // to string because to grouAdminID is in form of new Object()
  if (groupAdminId.toString() !== req.user.userId) {
    return res.status(401).send({
      message: 'Only admin can add',
    });
  }
  const added = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    res.status(404).send({ message: 'Chat not found' });
  } else {
    res.json(added);
  }
};

// Remove from group
export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  console.log(req.body);

  // check if the requester is admin
  const chat = await chatModel.findById(chatId);
  const groupAdminId = chat.groupAdmin._id;
  // console.log(chat);
  // console.log(groupAdminId, req.user.userId);
  // to string because to grouAdminID is in form of new Object()
  if (groupAdminId.toString() !== req.user.userId) {
    return res.status(401).send({
      message: 'Only admin can remove',
    });
  }
  console.log(userId);

  try {
    const removed = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        {
          new: true,
        }
      )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removed) {
      res.status(404).send({
        success: false,
        message: 'Chat not found',
      });
    } else {
      res.status(200).json(removed);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
