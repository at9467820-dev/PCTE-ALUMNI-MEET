"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_SECRET;
if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary configuration. Set CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_SECRET.");
}
cloudinary_1.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});
exports.default = cloudinary_1.v2;
