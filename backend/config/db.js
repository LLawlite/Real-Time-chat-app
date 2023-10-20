import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URL);
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(
      `Connected to MongoDB Database ${mongoose.connection.host}`.cyan.bold
    );
  } catch (err) {
    console.log(`MongoDB Error ${err}`.bgRed.white);
  }
};
export default connectDB;
