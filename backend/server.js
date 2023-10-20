// Packages imports
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import morgan from 'morgan';

// importing dummy data
import { chats } from './data/data.js';

//file imports
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import groupRoutes from './routes/groupChatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// security Packages
import helmet from 'helmet';

//Import socket.io for realtime chat feature
import { Server } from 'socket.io';

// Config Dotenv
dotenv.config();

// rest-objects
const app = express();

//establis connectoin to database
connectDB();
// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/group-chats', groupRoutes);
app.use('/api/v1/messages', messageRoutes);

app.get('/', (req, res) => {
  return res.status(200).json({
    name: 'HEllow',
  });
});

app.get('/api/chats', (req, res) => {
  res.send(chats);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`.yellow.bold);
});

// Etablishing real time connections
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  //Every time user opens the app connect him to his own personal socket
  socket.on('setup', (userData) => {
    // this room will be exsclusive for this userData
    socket.join(userData._id);
    socket.emit('connected');
  });

  //socket for joining a chat
  socket.on('join chat', (room) => {
    socket.join(room);
    // console.log('User Joinded Room: ' + room);
  });

  //Create new socket for typing
  socket.on('typing', (room) => {
    socket.in(room).emit('typing');
  });
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  // New message socket
  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log('chat.users not defined');

    //emit message to all the users in the chat expect the currently logged in user
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit('message received', newMessageRecieved);
    });
  });

  // socket clean up
  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
