"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alumniMeetUpload = exports.adminPicUpload = exports.profilePicWithBgUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudnary_1 = __importDefault(require("../config/cloudnary"));
const fs_1 = __importDefault(require("fs"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudnary_1.default,
    params: (req, file) => {
        const isVideo = file.mimetype.startsWith("video");
        return {
            folder: isVideo ? "alumniMeet/videos" : "alumniMeet/images",
            resource_type: isVideo ? "video" : "image",
            allowed_formats: isVideo ? ["mp4"] : ["jpg", "png", "jpeg", "webp"],
        };
    },
});
const profilePicWithBgStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudnary_1.default,
    params: (req, file) => {
        return {
            folder: "alumniMeet/profilePic",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
        };
    }
});
const adminPicStorafe = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudnary_1.default,
    params: (req, file) => {
        return {
            folder: "alumniMeet/admin",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
        };
    }
});
const profilePicStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join("public", "uploads", "profilePic");
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = path_1.default.extname(file.originalname);
        const name = `${uniqueName}${extension}`;
        req.fileName = name;
        cb(null, name);
    },
});
// export const profilePicUpload = multer({ storage: profilePicStorage})
exports.profilePicWithBgUpload = (0, multer_1.default)({ storage: profilePicWithBgStorage });
exports.adminPicUpload = (0, multer_1.default)({ storage: adminPicStorafe });
exports.alumniMeetUpload = (0, multer_1.default)({ storage }).fields([
    { name: "images", maxCount: 50 },
    { name: "video", maxCount: 1 },
]);
