const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Product name is required"], lowercase: true, trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    price: { type: Number, required: [true, "Price is required"], min: [0, "Price cannot be negative"] },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: [true, "Category is required"] },
    stock: { type: Number, required: [true, "Stock quantity is required"], min: 0, default: 0 },
    imagesUrl: [{ type: String, required: true }],
    slug: { type: String, unique: true, lowercase: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

productSchema.pre("save", function (next) {
    if (!this.isModified('name')) return next();
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

module.exports = mongoose.model("Product", productSchema);