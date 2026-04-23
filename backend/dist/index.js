import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { initDB } from './config/database';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from "./utility/globalError";
import alumniMeetRoute from './routes/alumniMeet.route';
import adminAuthRoute from './routes/auth.route';
import reportRoute from './routes/report.route';
import alumniMeetCron, { alumniTalkStatus } from './utility/scheduledTask';
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
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Initialize SQLite database FIRST
initDB();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5175",
        "https://pcte-alumni-talk-dep-ready.vercel.app",
        "https://pcte-alumni-talk-dep-ready-7smeq2pj4-ankits-projects-0633ce92.vercel.app",
        "http://192.168.29.104:5173"
    ],
    credentials: truprocess.e
}));
app.use("/", alumniMeetRoute);
app.use("/admin", adminAuthRoute);
app.use("/report", reportRoute);
app.use(globalErrorHandler);
// Start cron job and run initial status update AFTER DB is ready
alumniMeetCron.start();
alumniTalkStatus();
const PORT = Number(env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
