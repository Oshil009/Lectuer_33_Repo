const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, quantity: { type: Number, required: true, min: 1 }, price: { type: Number, required: true } }],
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
    shippingAddress: {
        city: { type: String, required: [true, "City is required"] }, street: { type: String, required: [true, "Street is required"] }, phone: { type: String, required: [true, "Phone number is required"] }}
}, { timestamps: true });
module.exports = mongoose.model("Order", orderSchema);