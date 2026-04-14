const userModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const users = await userModel.find({})
            .populate('role')
            .select('-password')
            .limit(limit)
            .skip(skip);

        const totalUsers = await userModel.countDocuments({});
        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            success: true,
            results: users.length,
            pagination: { totalUsers, totalPages, currentPage: page, limit },
            data: users
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
            .populate('role')
            .populate('favorites')
            .select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User profile fetched successfully", data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const { role, password, ...safeBody } = req.body;
        Object.assign(user, safeBody);
        await user.save();
        const updatedUser = await userModel.findById(req.user.id).select('-password').populate('role');
        res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) return res.status(400).json({ success: false, message: "Current password is incorrect" });

        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const toggleFavorite = async (req, res) => {
    const { productId } = req.params;
    try {
        const user = await userModel.findById(req.user.id);
        const index = user.favorites.findIndex(id => id.toString() === productId);
        if (index > -1) {
            user.favorites.splice(index, 1);
        } else {
            user.favorites.push(productId);
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: index > -1 ? "Removed from favorites" : "Added to favorites",
            data: user.favorites
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new userModel({ name, email, password });
        const savedUser = await newUser.save();
        const userResponse = savedUser.toObject();
        delete userResponse.password;
        res.status(201).json({ success: true, message: "The user has been created", data: userResponse });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, message: "The email already exists" });
        }
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    try {
        const user = await userModel.findOne({ email: email.toLowerCase() }).populate('role');
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const payload = {
            id: user._id,
            type: user.role.role,
            permissions: user.role.permissions
        };
        const userToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "2h" });
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(200).json({ success: true, message: "Login successfully", token: userToken, data: userResponse });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

module.exports = { getAllUsers, getProfile, updateProfile, changePassword, deleteUser, toggleFavorite, createUser, login };
