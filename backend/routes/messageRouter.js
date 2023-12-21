import express from 'express';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

router.post('/create', messageController.createMessage);
router.get('/getAll/:userId/:threadId', messageController.getAllMessages);

export default router;
