"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenBlacklistedDao = exports.logoutDao = exports.loginDao = exports.registerDao = exports.getFullUserDao = exports.isUserExistDao = void 0;
const database_1 = __importDefault(require("../config/database"));
const crypto_1 = require("crypto");
const customErrors_1 = require("../utility/customErrors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const isUserExistDao = async (email) => {
    const row = database_1.default.prepare('SELECT _id FROM users WHERE email = ? COLLATE NOCASE').get(email);
    return Boolean(row);
};
exports.isUserExistDao = isUserExistDao;
const getFullUserDao = async (id) => {
    if (!id)
        throw new customErrors_1.BadRequestError("Invalid user ID format");
    const row = database_1.default.prepare('SELECT * FROM users WHERE _id = ?').get(id);
    if (!row)
        throw new customErrors_1.NotFoundError("User not found");
    return {
        _id: row._id, name: row.name, email: row.email, password: row.password,
        phone: row.phone,
        avatar: { url: row.avatar_url || '', public_id: row.avatar_public_id || '' },
        createdAt: row.createdAt, updatedAt: row.updatedAt,
    };
};
exports.getFullUserDao = getFullUserDao;
const registerDao = async (data) => {
    const _id = (0, crypto_1.randomUUID)();
    const now = new Date().toISOString();
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
    let avatarUrl = data.avatar?.url || '';
    let avatarPublicId = data.avatar?.public_id || '';
    if (!avatarUrl) {
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff&size=128&bold=true&rounded=true`;
    }
    database_1.default.prepare(`INSERT INTO users (_id,name,email,password,phone,avatar_url,avatar_public_id,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?)`).run(_id, data.name, data.email.toLowerCase(), hashedPassword, '', avatarUrl, avatarPublicId, now, now);
    const row = database_1.default.prepare('SELECT * FROM users WHERE _id = ?').get(_id);
    return {
        _id: row._id, name: row.name, email: row.email, password: row.password,
        avatar: { url: row.avatar_url, public_id: row.avatar_public_id },
        createdAt: row.createdAt, updatedAt: row.updatedAt,
    };
};
exports.registerDao = registerDao;
const loginDao = async (data) => {
    const row = database_1.default.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(data.email);
    if (!row)
        throw new Error("User not found");
    const isMatch = await bcryptjs_1.default.compare(data.password, row.password);
    if (!isMatch)
        throw new Error("Password is incorrect");
    return {
        _id: row._id, name: row.name, email: row.email, password: row.password,
        avatar: { url: row.avatar_url, public_id: row.avatar_public_id },
        createdAt: row.createdAt, updatedAt: row.updatedAt,
    };
};
exports.loginDao = loginDao;
const logoutDao = async (token) => {
    const _id = (0, crypto_1.randomUUID)();
    const oneDay = 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + oneDay).toISOString();
    database_1.default.prepare('INSERT OR IGNORE INTO blacklist (_id,token,expiresAt) VALUES (?,?,?)').run(_id, token, expiresAt);
    return { message: "User logged out successfully" };
};
exports.logoutDao = logoutDao;
const isTokenBlacklistedDao = async (token) => {
    const row = database_1.default.prepare('SELECT _id FROM blacklist WHERE token = ?').get(token);
    return Boolean(row);
};
exports.isTokenBlacklistedDao = isTokenBlacklistedDao;
