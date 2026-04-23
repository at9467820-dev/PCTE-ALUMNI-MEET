"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenBlacklistedDao = exports.logoutDao = exports.loginDao = exports.registerDao = exports.getFullUserDao = exports.isUserExistDao = void 0;
const models_1 = require("../config/models");
const customErrors_1 = require("../utility/customErrors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function toUser(doc) {
    const obj = doc.toObject ? doc.toObject({ versionKey: false }) : { ...doc };
    obj._id = obj._id?.toString();
    return obj;
}
const isUserExistDao = async (email) => {
    const doc = await models_1.UserModel.exists({ email: email.toLowerCase() });
    return Boolean(doc);
};
exports.isUserExistDao = isUserExistDao;
const getFullUserDao = async (id) => {
    if (!id)
        throw new customErrors_1.BadRequestError('Invalid user ID format');
    const doc = await models_1.UserModel.findById(id);
    if (!doc)
        throw new customErrors_1.NotFoundError('User not found');
    return toUser(doc);
};
exports.getFullUserDao = getFullUserDao;
const registerDao = async (data) => {
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
    let avatarUrl = data.avatar?.url || '';
    if (!avatarUrl) {
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff&size=128&bold=true&rounded=true`;
    }
    const doc = await models_1.UserModel.create({
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        avatar: {
            url: avatarUrl,
            public_id: data.avatar?.public_id || '',
        },
    });
    return toUser(doc);
};
exports.registerDao = registerDao;
const loginDao = async (data) => {
    const doc = await models_1.UserModel.findOne({ email: data.email.toLowerCase() });
    if (!doc)
        throw new Error('User not found');
    const isMatch = await bcryptjs_1.default.compare(data.password, doc.password);
    if (!isMatch)
        throw new Error('Password is incorrect');
    return toUser(doc);
};
exports.loginDao = loginDao;
const logoutDao = async (token) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + oneDay);
    await models_1.BlacklistModel.create({ token, expiresAt });
    return { message: 'User logged out successfully' };
};
exports.logoutDao = logoutDao;
const isTokenBlacklistedDao = async (token) => {
    const doc = await models_1.BlacklistModel.exists({ token });
    return Boolean(doc);
};
exports.isTokenBlacklistedDao = isTokenBlacklistedDao;
