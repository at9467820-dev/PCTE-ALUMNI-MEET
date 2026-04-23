"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalError_1 = __importDefault(require("./utility/globalError"));
const alumniMeet_route_1 = __importDefault(require("./routes/alumniMeet.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const report_route_1 = __importDefault(require("./routes/report.route"));
const scheduledTask_1 = __importStar(require("./utility/scheduledTask"));
// Environment validation
function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but was not provided.`);
    }
    return value;
}
// Validate required environment variables
requireEnv("JWT_SECRET");
requireEnv("CLOUDINARY_NAME");
requireEnv("CLOUDINARY_API_KEY");
requireEnv("CLOUDINARY_SECRET");
const app = (0, express_1.default)();
// Initialize SQLite database FIRST
(0, database_1.initDB)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:5175",
        "https://pcte-alumni-talk-dep-ready.vercel.app",
        "https://pcte-alumni-talk-dep-ready-7smeq2pj4-ankits-projects-0633ce92.vercel.app",
        "http://192.168.29.104:5173"
    ],
    credentials: process.env.NODE_ENV === "production" ? true : true
}));
app.use("/", alumniMeet_route_1.default);
app.use("/admin", auth_route_1.default);
app.use("/report", report_route_1.default);
app.use(globalError_1.default);
// Start cron job and run initial status update AFTER DB is ready
scheduledTask_1.default.start();
(0, scheduledTask_1.alumniTalkStatus)();
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
