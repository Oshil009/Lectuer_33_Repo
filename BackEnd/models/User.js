const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "The Name is Required"] },
    email: { type: String, required: [true, "The Email is Required"], unique: true, trim: true, lowercase: true },
    password: { type: String, required: false },
    googleId: { type: String, default: null },
    avatar: { type: String, default: null },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    if (!this.role) {
        const Role = mongoose.model("Role");
        const defaultRole = await Role.findOne({ role: "user" });
        if (defaultRole) this.role = defaultRole._id;
    }
    next();
});

module.exports = mongoose.model("User", userSchema);
