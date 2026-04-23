"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but was not provided.`);
    }
    return value;
}
exports.env = {
    PORT: process.env.PORT || "3000",
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: requireEnv("JWT_SECRET"),
    CLOUDINARY_NAME: requireEnv("CLOUDINARY_NAME"),
    CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
    CLOUDINARY_SECRET: requireEnv("CLOUDINARY_SECRET"),
};
