"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utility/jwt");
const customErrors_1 = require("../utility/customErrors");
const authMiddleware = async (req, res, next) => {
    try {
        console.log(req.cookies);
        const token = req.cookies.authToken;
        console.log(token);
        if (!token) {
            throw new customErrors_1.UnauthorizedError("Unauthorized access");
        }
        const decode = await (0, jwt_1.verifyToken)(token);
        if (!decode) {
            throw new customErrors_1.UnauthorizedError("Unauthorized access");
        }
        req.user = decode;
        next();
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
exports.authMiddleware = authMiddleware;
