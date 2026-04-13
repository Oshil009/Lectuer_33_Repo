const roleModel = require('../models/Role');
const createRole = async (req, res) => {
    const { role, permissions } = req.body;
    if (!role || !permissions || !Array.isArray(permissions)) {
        return res.status(400).json({
            success: false,
            message: "Please provide role name and permissions as an array"
        });
    }
    try {
        const newRole = new roleModel({ role, permissions });
        const result = await newRole.save();
        res.status(201).json({
            success: true,
            message: "Role has been created",
            data: result
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Role name already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
const getAllRole = async (req, res) => {
    try {
        const roles = await roleModel.find({})
        res.status(200).json({
            success: true,
            message: "This is All Role",
            data: roles
        })
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch roles",
            error: err.message
        });
    }
}
const updateRole = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRole = await roleModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Role has been updated",
            result: updatedRole
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
const deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRole = await roleModel.findByIdAndDelete(id);
        if (!deletedRole) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Role has been deleted",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
module.exports = { createRole, getAllRole, updateRole, deleteRole }