const express = require('express');
const orderRouter = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

orderRouter.post('/', auth, createOrder);
orderRouter.get('/my', auth, getMyOrders);
orderRouter.get('/', auth, authorizeRole('admin'), getAllOrders);
orderRouter.get('/:id', auth, getOrderById);
orderRouter.patch('/:id/status', auth, authorizeRole('admin'), updateOrderStatus);

module.exports = orderRouter;
