const reviewModel = require('../models/review');

const addReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    try {
        const review = await reviewModel.create({ userId, productId, rating, comment });
        res.status(201).json({ success: true, data: review });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ success: false, message: "You already reviewed this product" });
        res.status(500).json({ success: false, error: err.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find({ productId: req.params.productId }).populate('userId', 'name');
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    try {
        const review = await reviewModel.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to update this review" });
        }
        const updatedReview = await reviewModel.findByIdAndUpdate(
            id,
            { rating, comment },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, message: "Review updated", data: updatedReview });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        const review = await reviewModel.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        if (review.userId.toString() !== req.user.id && req.user.type !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
        }
        await reviewModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { addReview, getProductReviews, updateReview, deleteReview };
