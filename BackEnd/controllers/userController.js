const userModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).populate('role').select('-password');
        if (users.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No users found in the database",
                data: []
            });
        }
        res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            data: users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};
const getProfile = async (req, res) => {
    const { id } = req.body;
    try {
        const user = await userModel.findById(id)
            .populate('role')
            .select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};
const updateProfile = async (req, res) => {
    const { id } = req.body;
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        Object.assign(user, req.body);
        await user.save();
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
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
}
const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new userModel({
            name, email, password
        });
        const savedUser = await newUser.save();
        res.status(201).json({
            success: true,
            message: "The user has been created",
            data: savedUser
        });
    } catch (err) {
        if (err.keyPattern) {
            return res.status(409).json({
                success: false,
                message: "The email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email.toLowerCase() }).populate('role');
        if (!user) {
            return res.status(404).json("Email is not registered or Password not matched")
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(404).json("Email is not registered or Password not matched")
        }
        const payload = {
            id: user._id,
            type: user.role.role,
            permissions: user.role.permissions
        }
        const options = {
            expiresIn: "2h"
        }
        user.password=undefined;
        const userToken = await jwt.sign(payload, process.env.JWT_ACCESS_SECRET, options);
        res.status(200).json({
            success: true,
            message: "login successfully",
            token: userToken,
            data: user
        })
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }

}
module.exports = { getAllUsers, getProfile, updateProfile, deleteUser, createUser, login }