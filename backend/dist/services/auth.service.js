"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutService = exports.loginService = exports.registerService = exports.getFullUserService = void 0;
const auth_dao_1 = require("../dao/auth.dao");
const customErrors_1 = require("../utility/customErrors");
const jwt_1 = require("../utility/jwt");
const getFullUserService = async (id) => {
    return await (0, auth_dao_1.getFullUserDao)(id);
};
exports.getFullUserService = getFullUserService;
const registerService = async (data) => {
    const { name, email, password, confirmPassword, avatar } = data;
    if (!name || !email || !password || !confirmPassword)
        throw new customErrors_1.ValidationError("Please fill all the fields");
    if (password !== confirmPassword)
        throw new customErrors_1.ValidationError("Password and Confirm Password must match");
    if (password.length < 8)
        throw new customErrors_1.ValidationError("Password must be at least 8 characters long");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        throw new customErrors_1.ValidationError("Please enter a valid email address");
    const isExist = await (0, auth_dao_1.isUserExistDao)(email);
    if (isExist)
        throw new customErrors_1.ValidationError("User with this email already exists");
    const user = await (0, auth_dao_1.registerDao)({ name, email, password, avatar });
    const token = await (0, jwt_1.generateToken)({ id: user._id, email: user.email });
    return { user, token };
};
exports.registerService = registerService;
const loginService = async (data) => {
    const { email, password } = data;
    if (!email || !password)
        throw new customErrors_1.ValidationError("Please fill all the fields");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        throw new customErrors_1.ValidationError("Please enter a valid email address");
    const user = await (0, auth_dao_1.loginDao)({ email, password });
    if (!user)
        throw new customErrors_1.ValidationError("Invalid email or password");
    const token = await (0, jwt_1.generateToken)({ id: user._id, email: user.email });
    return { user, token };
};
exports.loginService = loginService;
const logoutService = async (token) => {
    if (!token)
        throw new Error("Token is required for logout");
    try {
        const result = await (0, auth_dao_1.logoutDao)(token);
        return { message: result.message };
    }
    catch (err) {
        throw new Error("Logout failed: " + err.message);
    }
};
exports.logoutService = logoutService;
