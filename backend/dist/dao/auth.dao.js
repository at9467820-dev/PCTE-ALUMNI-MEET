import db from '../config/database';
import { randomUUID } from 'crypto';
import { BadRequestError, NotFoundError } from '../utility/customErrors';
import bcrypt from 'bcryptjs';
export const isUserExistDao = async (email) => {
    const row = db.prepare('SELECT _id FROM users WHERE email = ? COLLATE NOCASE').get(email);
    return Boolean(row);
};
export const getFullUserDao = async (id) => {
    if (!id)
        throw new BadRequestError("Invalid user ID format");
    const row = db.prepare('SELECT * FROM users WHERE _id = ?').get(id);
    if (!row)
        throw new NotFoundError("User not found");
    return {
        _id: row._id, name: row.name, email: row.email, password: row.password,
        phone: row.phone,
        avatar: { url: row.avatar_url || '', public_id: row.avatar_public_id || '' },
        createdAt: row.createdAt, updatedAt: row.updatedAt,
    };
};
export const registerDao = async (data) => {
    const _id = randomUUID();
    const now = new Date().toISOString();
    const hashedPassword = await bcrypt.hash(data.password, 12);
    let avatarUrl = data.avatar?.url || '';
    let avatarPublicId = data.avatar?.public_id || '';
    if (!avatarUrl) {
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff&size=128&bold=true&rounded=true`;
    }
    db.prepare(`INSERT INTO users (_id,name,email,password,phone,avatar_url,avatar_public_id,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?)`).run(_id, data.name, data.email.toLowerCase(), hashedPassword, '', avatarUrl, avatarPublicId, now, now);
    const row = db.prepare('SELECT * FROM users WHERE _id = ?').get(_id);
    return {
        _id: row._id, name: row.name, email: row.email, password: row.password,
        avatar: { url: row.avatar_url, public_id: row.avatar_public_id },
        createdAt: row.createdAt, updatedAt: row.updatedAt,
    };
};
export const loginDao = async (data) => {
    const row = db.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(data.email);
    if (!row)
        throw new Error("User not found");
    const isMatch = await bcrypt.compare(data.password, row.password);
    if (!isMatch)
        throw new Error("Password is incorrect");
    return {
        _id: row._id, name: row.name, email: row.email, password: row.password,
        avatar: { url: row.avatar_url, public_id: row.avatar_public_id },
        createdAt: row.createdAt, updatedAt: row.updatedAt,
    };
};
export const logoutDao = async (token) => {
    const _id = randomUUID();
    const oneDay = 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + oneDay).toISOString();
    db.prepare('INSERT OR IGNORE INTO blacklist (_id,token,expiresAt) VALUES (?,?,?)').run(_id, token, expiresAt);
    return { message: "User logged out successfully" };
};
export const isTokenBlacklistedDao = async (token) => {
    const row = db.prepare('SELECT _id FROM blacklist WHERE token = ?').get(token);
    return Boolean(row);
};
