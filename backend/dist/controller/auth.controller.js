import { getFullUserService, loginService, logoutService, registerService } from "../services/auth.service";
import { cookieOptions } from "../config/cookie.config";
import { deleteFromCloudinary } from "../utility/cloudnaryDeletion";
import { UnauthorizedError } from "../utility/customErrors";
export const adminRegister = async (req, res, next) => {
    let file;
    try {
        file = req.file;
        const data = req.body;
        const { user, token } = await registerService({
            ...data,
            avatar: { url: file?.path, public_id: file?.filename },
        });
        const safeUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
        };
        res.cookie("authToken", token, cookieOptions);
        return res.status(201).json({
            status: "success",
            message: "Admin registered successfully",
            user: safeUser,
        });
    }
    catch (err) {
        if (file) {
            await deleteFromCloudinary(file.filename);
        }
        next(err);
    }
};
export const login = async (req, res, next) => {
    try {
        const data = req.body;
        const { user, token } = await loginService(data);
        res.cookie("authToken", token, cookieOptions);
        return res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            user: user,
        });
    }
    catch (err) {
        next(err);
    }
};
export const logout = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        const { message } = await logoutService(token);
        res.clearCookie("authToken");
        return res.status(200).json({ message });
    }
    catch (err) {
        next(err);
    }
};
export const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedError("Unauthorized access");
        }
        const fullUser = await getFullUserService(user.id);
        return res.status(200).json({ status: "success", data: fullUser, message: "user fetched successfully" });
    }
    catch (err) {
        next(err);
    }
};
