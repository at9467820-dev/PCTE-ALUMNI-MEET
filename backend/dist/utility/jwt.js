import jwt from 'jsonwebtoken';
export const generateToken = async (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables!");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};
export const verifyToken = async (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables!");
    }
    return jwt.verify(token, process.env.JWT_SECRET);
};
