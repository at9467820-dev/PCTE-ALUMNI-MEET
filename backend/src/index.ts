import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import path from "path";
import { initDB } from './config/database';
import { seedDefaultAdmin } from './config/seed';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from "./utility/globalError";
import alumniMeetRoute from './routes/alumniMeet.route';
import adminAuthRoute from './routes/auth.route';
import reportRoute from './routes/report.route';
import alumniMeetCron, { alumniTalkStatus } from './utility/scheduledTask';

// Environment validation
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required but was not provided.`);
  }
  return value;
}

requireEnv("MONGO_URI");
requireEnv("JWT_SECRET");
requireEnv("CLOUDINARY_NAME");
requireEnv("CLOUDINARY_API_KEY");
requireEnv("CLOUDINARY_SECRET");

const app: Application = express();

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

app.use("/", alumniMeetRoute);
app.use("/admin", adminAuthRoute);
app.use("/report", reportRoute);

app.use(globalErrorHandler);

const PORT = Number(process.env.PORT) || 3000;

// Connect to MongoDB first, then start server
initDB()
  .then(async () => {
    await seedDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    // Start cron job AFTER DB is connected
    alumniMeetCron.start();
    alumniTalkStatus();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });