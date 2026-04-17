const cartModel = require('../models/cart');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        let cart = await cartModel.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += (quantity || 1);
            } else {
                cart.items.push({ productId, quantity: quantity || 1 });
            }
            await cart.save();
        } else {
            cart = await cartModel.create({
                userId,
                items: [{ productId, quantity: quantity || 1 }]
            });
        }

        const populated = await cartModel.findById(cart._id).populate('items.productId');
        res.status(200).json({ success: true, data: populated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) return res.status(200).json({ success: true, data: { items: [] } });
        res.status(200).json({ success: true, data: cart });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        const cart = await cartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true }
        ).populate('items.productId');

        res.status(200).json({ success: true, message: 'Product removed', data: cart });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await cartModel.findOneAndUpdate(
            { userId: req.user.id },
            { $set: { items: [] } },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Cart cleared', data: cart });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { addToCart, getCart, removeFromCart, clearCart };
