import dotenv from "dotenv";
dotenv.config();
function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but was not provided.`);
    }
    return value;
}
export const env = {
    PORT: process.env.PORT || "3000",
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: requireEnv("JWT_SECRET"),
    CLOUDINARY_NAME: requireEnv("CLOUDINARY_NAME"),
    CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
    CLOUDINARY_SECRET: requireEnv("CLOUDINARY_SECRET"),
};
