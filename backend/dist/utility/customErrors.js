"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ValidationError = exports.ConflictError = exports.BadRequestError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = void 0;
// customErrors.ts
const error_1 = __importDefault(require("./error"));
// 401 Unauthorized
class UnauthorizedError extends error_1.default {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
// 403 Forbidden
class ForbiddenError extends error_1.default {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
// 404 Not Found
class NotFoundError extends error_1.default {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
// 400 Bad Request
class BadRequestError extends error_1.default {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
// 409 Conflict
class ConflictError extends error_1.default {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
// 422 Unprocessable Entity
class ValidationError extends error_1.default {
    constructor(message = "Validation Error") {
        super(message, 422);
    }
}
exports.ValidationError = ValidationError;
// 500 Internal Server Error
class InternalServerError extends error_1.default {
    constructor(message = "Internal Server Error") {
        super(message, 500, false); // Not always operational
    }
}
exports.InternalServerError = InternalServerError;
