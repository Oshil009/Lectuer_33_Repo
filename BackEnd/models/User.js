const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "The Name is Required"] },
    email: { type: String, required: [true, "The Email is Required"], unique: true, trim: true, lowercase: true },
    password: { type: String, required: [true, "The Password is Required"] },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, +process.env.SALT_ROUNDS);
        next();
    } catch (error) {
        next(error);
    }
});
userSchema.pre("save", async function (next) {
    if (!this.role) {
        const Role = mongoose.model("Role");
        const defaultRole = await Role.findOne({ role: "user" });
        if (defaultRole) {
            this.role = defaultRole._id;
        }
    }
    next();
})
module.exports = mongoose.model("User", userSchema);