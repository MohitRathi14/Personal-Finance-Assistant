import userController from '../controllers/userController.js';
import express from 'express';
const router = express.Router();

// get user profile route
router.get('/profile', (req, res) => userController.getUserProfileController(req, res));

// update user route
router.put('/:id', (req, res) => userController.updateUserController(req, res));

// delete user route
router.delete('/:id', (req, res) => userController.deleteUserController(req, res));

// additional user routes for admin
router.get('/', (req, res) => userController.getAllUsersController(req, res));
router.get('/:id', (req, res) => userController.getSingleUserController(req, res));




export default router;