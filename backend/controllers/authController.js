import { userModel } from '../models/userModel.js';

export const registerController = async (req, res) => {
  try {
    // console.log(req.body);
    const { fname, email, password, pic, isAdmin, lname } = req.body;
    const user = await userModel.create({
      email,
      password,
      fname,
      lname,
      pic,
      isAdmin,
    });
    const token = user.createJWT();
    res.status(201).send({
      success: true,
      message: 'User Created successfully',
      user: {
        _id: user._id,
        fname: user.fname,
        email: user.email,
        pic: user.pic,
        isAdmin: user.isAdmin,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(400).send({
        message: 'Email and password are required',
      });
    }

    // find user by email
    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).send({
        message: 'Invalid username or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({
        message: 'Invalid username or password',
      });
    }

    user.password = undefined;
    const token = user.createJWT();

    return res.status(200).send({
      success: true,
      message: 'Logged In Successfully',
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        pic: user.pic,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: err,
    });
  }
};
