import express from 'express';
import * as userController from '../controller/userController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateUser, userController.getUserProfileController);
router.put('/profile', authenticateUser, userController.updateUserProfileController);
router.get('/', authenticateUser, userController.getAllUsersController);
router.get('/:id', authenticateUser, userController.getSingleUserController);
router.put('/:id', authenticateUser, userController.updateUserController);
router.delete('/:id', authenticateUser, userController.deleteUserController);

export default router;