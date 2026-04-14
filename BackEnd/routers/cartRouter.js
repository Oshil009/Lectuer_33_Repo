const express = require('express');
const cartRouter = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const auth = require('../middleware/auth');

cartRouter.post('/add', auth, addToCart);
cartRouter.get('/', auth, getCart);
cartRouter.post('/remove', auth, removeFromCart);

module.exports = cartRouter;
