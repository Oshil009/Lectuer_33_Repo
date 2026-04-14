const productModel = require('../models/Product');

const getAllProducts = async (req, res) => {
    try {
        let { search, category, page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) filter.name = { $regex: search, $options: 'i' };
        if (category) filter.categoryId = category;
        const products = await productModel.find(filter)
            .populate('categoryId')
            .sort('-createdAt')
            .limit(limit)
            .skip(skip);
        const totalProducts = await productModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        res.status(200).json({
            success: true,
            results: products.length,
            pagination: { totalProducts, totalPages, currentPage: page, limit },
            data: products
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await productModel.find({ categoryId }).populate('categoryId').populate('createdBy', 'name');
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found for this category" });
        }
        res.status(200).json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productModel.findById(id).populate('categoryId').populate('createdBy', 'name');
        if (!product) {
            return res.status(404).json({ success: false, message: "No products found for this Id" });
        }
        res.status(200).json({ success: true, message: "Product fetched successfully", data: product });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "Invalid Product ID format" });
        }
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const createProduct = async (req, res) => {
    const { name, description, price, categoryId, stock, imagesUrl } = req.body;
    try {
        const newProduct = new productModel({ name, description, price, categoryId, stock, imagesUrl, createdBy: req.user.id });
        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, message: "Product created successfully", data: savedProduct });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, message: "Product name already exists, please use a unique name." });
        }
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const { createdBy, ...safeBody } = req.body;
        Object.assign(product, safeBody);
        const updatedProduct = await product.save();
        res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

module.exports = { getAllProducts, getProductById, getProductsByCategory, createProduct, updateProduct, deleteProduct };
