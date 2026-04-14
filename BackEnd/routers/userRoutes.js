const express = require('express');
const userRouter = express.Router();
const { 
    getAllUsers, getProfile, toggleFavorite, 
    updateProfile, changePassword, deleteUser, createUser, login 
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

userRouter.post('/register', createUser);
userRouter.post('/login', login);
userRouter.get('/profile', auth, getProfile);
userRouter.put('/profile', auth, updateProfile);
userRouter.put('/change-password', auth, changePassword);
userRouter.post('/favorite/:productId', auth, toggleFavorite);
userRouter.get('/', auth, authorizeRole('admin'), getAllUsers);
userRouter.delete('/:id', auth, authorizeRole('admin'), deleteUser);

module.exports = userRouter;
