const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    imageUrl: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);