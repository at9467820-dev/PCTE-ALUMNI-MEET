import { verifyToken } from "../utility/jwt";
import { UnauthorizedError } from "../utility/customErrors";
export const authMiddleware = async (req, res, next) => {
    try {
        console.log(req.cookies);
        const token = req.cookies.authToken;
        console.log(token);
        if (!token) {
            throw new UnauthorizedError("Unauthorized access");
        }
        const decode = await verifyToken(token);
        if (!decode) {
            throw new UnauthorizedError("Unauthorized access");
        }
        req.user = decode;
        next();
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
