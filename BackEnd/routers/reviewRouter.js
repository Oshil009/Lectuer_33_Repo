const express = require('express');
const reviewRouter = express.Router();
const { addReview, getProductReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

reviewRouter.post('/', auth, addReview);
reviewRouter.get('/product/:productId', getProductReviews);
reviewRouter.put('/:id', auth, updateReview);
reviewRouter.delete('/:id', auth, deleteReview);

module.exports = reviewRouter;
