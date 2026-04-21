const orderModel = require('../models/Order');
const productModel = require('../models/Product');
const cartModel = require('../models/cart');
const sendEmail = require('../utils/sendEmail');

const createOrder = async (req, res) => {
    const { items, shippingAddress } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    const userEmail = req.user.email;
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Your cart is empty or invalid' });
    }
    if (!shippingAddress || !shippingAddress.city || !shippingAddress.street || !shippingAddress.phone) {
        return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    try {
        let calculatedTotal = 0;
        for (const item of items) {
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Not enough stock for: ${product.name}` });
            }
            calculatedTotal += product.price * item.quantity;
            item.price = product.price;
        }
        for (const item of items) {
            await productModel.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }
        const newOrder = new orderModel({ user: userId, items, totalPrice: calculatedTotal, shippingAddress });
        const savedOrder = await newOrder.save();
        const emailSubject = 'Order Confirmed - ShopNow';
        const emailHtml = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #f39c12;">Order Confirmation</h1>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for shopping with us! We have successfully received your order.</p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
                <p style="margin: 0;"><strong>Order ID:</strong> ${savedOrder._id}</p>
            </div>
            <p>We will notify you as soon as your items are shipped.</p>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 0.8em; color: #777;">ShopNow Inc. | Amman, Jordan</p>
        </div>
    `;
        await sendEmail({
            email: userEmail,
            subject: emailSubject,
            html: emailHtml
        });
        const populatedOrder = await savedOrder.populate('user', 'name email');
        await cartModel.findOneAndUpdate({ userId }, { $set: { items: [] } });
        res.status(201).json({ success: true, message: 'Order placed successfully', data: populatedOrder });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user.id })
            .populate('items.productId', 'name price imagesUrl slug')
            .sort('-createdAt');
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.productId');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.user._id.toString() !== req.user.id && req.user.type !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        let { page = 1, limit = 20 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;
        const orders = await orderModel.find({})
            .populate('user', 'name email')
            .populate('items.productId', 'name price')
            .sort('-createdAt')
            .limit(limit)
            .skip(skip);
        const totalOrders = await orderModel.countDocuments({});
        const totalPages = Math.ceil(totalOrders / limit);
        res.status(200).json({
            success: true,
            results: orders.length,
            pagination: { totalOrders, totalPages, currentPage: page, limit },
            data: orders
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await orderModel.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.status(200).json({ success: true, message: 'Order status updated', data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
