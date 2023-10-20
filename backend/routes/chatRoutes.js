import express from 'express';
import { accessChat, fetchChats } from '../controllers/chatController.js';
import userAuth from '../middelwares/authMiddleware.js';
const router = express.Router();

// Routes
//POST ||  Create or get One to One chat
router.post('/', userAuth, accessChat);

// GET || Fetch the Chats
router.get('/', userAuth, fetchChats);
export default router;
