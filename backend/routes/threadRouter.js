import express from 'express';
import * as threadController from '../controllers/threadController.js';

const router = express.Router();

router.post('/create', threadController.createThread);
router.get('/:userId', threadController.getUserThreads);
router.delete('/delete/:userId/:threadId', threadController.deleteThread);

export default router;
