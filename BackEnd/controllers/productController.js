const productModel = require('../models/Product');
const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            filter.categoryId = category;
        }
        const allProducts = await productModel.find(filter)
            .populate('categoryId')
            .populate('createdBy', '-password');
        if (allProducts.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Products found",
                data: []
            });
        }
        res.status(200).json({
            success: true,
            message: "All Products fetched successfully",
            data: allProducts
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await productModel.find({ categoryId: categoryId })
            .populate('categoryId')
            .populate('createdBy', 'name');

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found for this category"
            });
        }

        res.status(200).json({
            success: true,
            message: `Products for category ${categoryId} fetched`,
            data: products
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productModel.findById(id)
            .populate('categoryId')
            .populate('createdBy', 'name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "No products found for this Id"
            });
        }
        res.status(200).json({
            success: true,
            message: `Product fetching successfully`,
            data: product
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID format"
            });
        }
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
const createProduct = async (req, res) => {
    const { name, description, price, categoryId, stock, imagesUrl, createdBy } = req.body;
    try {
        const newProduct = new productModel({
            name,
            description,
            price,
            categoryId,
            stock,
            imagesUrl,
            createdBy
        })
        const savedProduct = await newProduct.save();
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: savedProduct
        })
    } catch (err) {
        if (err.code === 11000 || err.keyPattern) {
            return res.status(409).json({
                success: false,
                message: "Product name already exists, please use a unique name."
            });
        }
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        Object.assign(product, req.body);
        const updatedProduct = await product.save();
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}

module.exports = {
    getAllProducts, getProductById, getProductsByCategory, createProduct, updateProduct, deleteProduct
}