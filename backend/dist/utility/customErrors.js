// customErrors.ts
import ApiError from "./error.js"; // or "./error.ts" if you're importing directly in TS
// 401 Unauthorized
export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
// 403 Forbidden
export class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}
// 404 Not Found
export class NotFoundError extends ApiError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}
// 400 Bad Request
export class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}
// 409 Conflict
export class ConflictError extends ApiError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}
// 422 Unprocessable Entity
export class ValidationError extends ApiError {
    constructor(message = "Validation Error") {
        super(message, 422);
    }
}
// 500 Internal Server Error
export class InternalServerError extends ApiError {
    constructor(message = "Internal Server Error") {
        super(message, 500, false); // Not always operational
    }
}
