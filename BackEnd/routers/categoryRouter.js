const express=require('express');
const { getAllCategories, createCategory, updateCategory, deleteCategory }=require('../controllers/categoryController');
const categoryRouter=express.Router();

categoryRouter.get('/', getAllCategories);
categoryRouter.post('/', createCategory);
categoryRouter.put('/:id', updateCategory);
categoryRouter.delete('/:id', deleteCategory);

module.exports=categoryRouter;