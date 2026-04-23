import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: Number, required: false },
    avatar: { url: String, public_id: String },
}, { timestamps: true });
adminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    if (!this.avatar || !this.avatar.url) {
        this.avatar = {
            url: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random&color=fff&size=128&bold=true&rounded=true`,
            public_id: "",
        };
    }
    next();
});
adminSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
export const userModel = mongoose.model("user", adminSchema);
