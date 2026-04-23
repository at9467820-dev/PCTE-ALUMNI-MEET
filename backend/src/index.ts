import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { initDB } from './config/database';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Initialize SQLite database FIRST
initDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5175",
      "https://pcte-alumni-talk-dep-ready.vercel.app",
      "https://pcte-alumni-talk-dep-ready-7smeq2pj4-ankits-projects-0633ce92.vercel.app",
      "http://192.168.29.104:5173"
    ],
    credentials: true
  })
);

import globalErrorHandler from "./utility/globalError";
import alumniMeetRoute from './routes/alumniMeet.route';
import adminAuthRoute from './routes/auth.route';
import reportRoute from './routes/report.route';
import alumniMeetCron, { alumniTalkStatus } from './utility/scheduledTask';

app.use("/", alumniMeetRoute);
app.use("/admin", adminAuthRoute);
app.use("/report", reportRoute);

app.use(globalErrorHandler);

// Start cron job and run initial status update AFTER DB is ready
alumniMeetCron.start();
alumniTalkStatus();

app.listen(3000, () => {
  console.log("listening on port 3000");
});