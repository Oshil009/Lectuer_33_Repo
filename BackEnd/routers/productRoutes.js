const express = require("express");
const productRouter = express.Router();
const { getAllProducts, getProductById, getProductsByCategory, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
productRouter.get('/', getAllProducts); 
productRouter.get('/:id', getProductById);
productRouter.get('/category/:categoryId', getProductsByCategory);
productRouter.post('/', createProduct); 
productRouter.put('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);

module.exports = productRouter;