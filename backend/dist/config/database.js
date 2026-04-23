"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = initDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function initDB() {
    const uri = process.env.MONGO_URI;
    if (!uri)
        throw new Error('MONGO_URI is not defined in environment variables');
    await mongoose_1.default.connect(uri);
    console.log('MongoDB connected successfully');
}
exports.default = mongoose_1.default;
