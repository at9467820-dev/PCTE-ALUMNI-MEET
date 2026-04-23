"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("./error"));
const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof error_1.default) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    res.status(500).json({
        success: false,
        message: err.message || "Something went wrong",
    });
};
exports.default = globalErrorHandler;
