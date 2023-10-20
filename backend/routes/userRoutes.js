import express from 'express';
import userAuth from '../middelwares/authMiddleware.js';
import { getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Routes

//get all users
router.get('/', userAuth, getAllUsers);

//export
export default router;
