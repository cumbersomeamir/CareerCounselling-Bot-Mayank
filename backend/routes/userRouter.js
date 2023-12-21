import express from 'express';
import {
    createUser,
    findUser,
    listUsers,
    deleteUser
  } from '../controllers/userController.js';

const router = express.Router();

router.post('/create', createUser);
router.get('/:userId', findUser);
router.get('/', listUsers);
router.delete('/delete/:userId', deleteUser);

export default router;
