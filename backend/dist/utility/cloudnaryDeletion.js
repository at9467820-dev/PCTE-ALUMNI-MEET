"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = void 0;
const cloudnary_1 = __importDefault(require("../config/cloudnary"));
const deleteFromCloudinary = async (media, type = "image") => {
    try {
        const mediaArray = Array.isArray(media) ? media : [media];
        const deletedPromises = mediaArray.map((publicId) => {
            return cloudnary_1.default.uploader.destroy(publicId, {
                resource_type: type,
            });
        });
        const results = await Promise.all(deletedPromises);
        console.log("Delete results:", results);
        return results;
    }
    catch (err) {
        console.error("Error deleting media from Cloudinary:", err.message);
        throw new Error("Failed to delete one or more media files from Cloudinary.");
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
