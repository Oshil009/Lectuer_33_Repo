const express =require('express')
const userRouter = express.Router();
const { getAllUsers, getProfile, updateProfile, deleteUser, createUser, login }=require('../controllers/userController');
userRouter.post('/register', createUser);
userRouter.post('/login', login);
userRouter.get('/profile', getProfile);
userRouter.put('/profile', updateProfile);
userRouter.get('/', getAllUsers);
userRouter.delete('/:id', deleteUser);

module.exports = userRouter;