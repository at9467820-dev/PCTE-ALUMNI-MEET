"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.adminRegister = void 0;
const auth_service_1 = require("../services/auth.service");
const cookie_config_1 = require("../config/cookie.config");
const cloudnaryDeletion_1 = require("../utility/cloudnaryDeletion");
const customErrors_1 = require("../utility/customErrors");
const adminRegister = async (req, res, next) => {
    let file;
    try {
        file = req.file;
        const data = req.body;
        const { user, token } = await (0, auth_service_1.registerService)({
            ...data,
            avatar: { url: file?.path, public_id: file?.filename },
        });
        const safeUser = {
            id: user._id, name: user.name, email: user.email,
            avatar: user.avatar, createdAt: user.createdAt,
        };
        res.cookie("authToken", token, cookie_config_1.cookieOptions);
        return res.status(201).json({ status: "success", message: "Admin registered successfully", user: safeUser });
    }
    catch (err) {
        if (file)
            await (0, cloudnaryDeletion_1.deleteFromCloudinary)(file.filename);
        next(err);
    }
};
exports.adminRegister = adminRegister;
const login = async (req, res, next) => {
    try {
        const data = req.body;
        const { user, token } = await (0, auth_service_1.loginService)(data);
        res.cookie("authToken", token, cookie_config_1.cookieOptions);
        return res.status(200).json({ status: "success", message: "User logged in successfully", user });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        const { message } = await (0, auth_service_1.logoutService)(token);
        res.clearCookie("authToken");
        return res.status(200).json({ message });
    }
    catch (err) {
        next(err);
    }
};
exports.logout = logout;
const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            throw new customErrors_1.UnauthorizedError("Unauthorized access");
        const fullUser = await (0, auth_service_1.getFullUserService)(user.id);
        return res.status(200).json({ status: "success", data: fullUser, message: "user fetched successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.getMe = getMe;
