import express from 'express';
import userAuth from '../middelwares/authMiddleware.js';
import {
  addToGroup,
  createGroupChat,
  removeFromGroup,
  renameGroup,
} from '../controllers/groupController.js';
const router = express.Router();

// POST ||  create group chat
router.post('/', userAuth, createGroupChat);

// PUT || Rename Group
router.put('/rename-group', userAuth, renameGroup);

// PUT || Add user to group
router.put('/add-to-group', userAuth, addToGroup);

// PUT || Remove from group
router.put('/remove-from-group', userAuth, removeFromGroup);

export default router;
