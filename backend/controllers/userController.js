import { userModel } from '../models/userModel.js';

// GET All USERS
export const getAllUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { fname: { $regex: req.query.search, $options: 'i' } },
          {
            email: {
              $regex: req.query.search,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  const users = await userModel.find(keyword).find({
    _id: { $ne: req.user.userId },
  });

  res.status(200).send(users);
};
