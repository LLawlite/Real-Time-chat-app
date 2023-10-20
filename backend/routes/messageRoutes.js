import express from 'express';
import userAuth from '../middelwares/authMiddleware.js';
import { sendMessage, allMessages } from '../controllers/messageController.js';
const router = express.Router();

//Routes
//  POST || send message
router.post('/', userAuth, sendMessage);

//GET ||  fetch message for one single chat
router.get('/:chatId', userAuth, allMessages);

export default router;
