const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
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

// Google OAuth
userRouter.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

userRouter.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }),
    async (req, res) => {
        try {
            const user = await require('../models/User')
                .findById(req.user._id)
                .populate('role')
                .select('-password');

            const payload = {
                id: user._id,
                type: user.role?.role || 'user',
                permissions: user.role?.permissions || []
            };

            const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '2h' });
            const userData = encodeURIComponent(JSON.stringify(user));

            res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${userData}`);
        } catch (err) {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
        }
    }
);

module.exports = userRouter;
