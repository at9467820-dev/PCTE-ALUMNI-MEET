import mongoose from "mongoose";
import { userModel } from "../model/user.model";
import { blacklistModel } from "../model/blackList.model";
import { BadRequestError, NotFoundError } from "../utility/customErrors";
export const isUserExistDao = async (email) => {
    const user = await userModel.exists({ email });
    return Boolean(user);
};
export const getFullUserDao = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid user ID format");
    }
    const user = await userModel.findById(id);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return user;
};
export const registerDao = async (data) => {
    try {
        let user;
        if (data.avatar?.url) {
            user = new userModel(data);
        }
        else {
            user = new userModel({ name: data.name, email: data.email, password: data.password });
        }
        await user.save();
        return user;
    }
    catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            throw new Error("Validation error: " + err.message);
        }
        throw err;
    }
};
export const loginDao = async (data) => {
    try {
        const user = await userModel.findOne({ email: data.email });
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await user.comparePassword(data.password);
        if (!isMatch) {
            throw new Error("Password is incorrect");
        }
        return user;
    }
    catch (err) {
        throw err;
    }
};
export const logoutDao = async (token) => {
    try {
        const oneDay = 24 * 60 * 60 * 1000;
        const expiresAt = new Date(Date.now() + oneDay);
        const blacklisted = new blacklistModel({ token, expiresAt });
        await blacklisted.save();
        return { message: "User logged out successfully" };
    }
    catch (err) {
        throw new Error("Error while blacklisting token: " + err.message);
    }
};
