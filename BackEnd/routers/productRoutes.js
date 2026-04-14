const express = require("express");
const productRouter = express.Router();
const { getAllProducts, getProductById, getProductsByCategory, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

productRouter.get('/', getAllProducts);
productRouter.post('/', auth, authorizeRole('admin'), createProduct);
productRouter.get('/category/:categoryId', getProductsByCategory);
productRouter.get('/:id', getProductById);
productRouter.put('/:id', auth, authorizeRole('admin'), updateProduct);
productRouter.delete('/:id', auth, authorizeRole('admin'), deleteProduct);

module.exports = productRouter;
