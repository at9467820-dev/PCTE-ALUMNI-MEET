"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class apiError extends Error {
    constructor(message = "something went wrong", statusCode = 500, isOperational = true) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = apiError;
