import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import validator from 'validator';

const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, 'Name is required'],
    },
    lname: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
      required: [true, 'email is required'],
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, 'Password is required '],
      minlength: [6, 'Password should be at least 6 characters long'],
    },
    pic: {
      type: String,

      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestaps: true }
);

// middleware
userSchema.pre('save', async function () {
  if (!this.isModified) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  });
};
const userModel = mongoose.model('User', userSchema);

export { userModel };
