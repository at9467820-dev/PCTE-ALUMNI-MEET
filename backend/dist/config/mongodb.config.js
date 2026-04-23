import mongoose from 'mongoose';
import alumniMeetCron from '../utility/scheduledTask';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/alumniDB";
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
        });
        alumniMeetCron.start();
        console.log("connected to mongodb");
    }
    catch (error) {
        console.log("mongodb connection failed: ", error);
        console.log("Server will continue without database. Fix MONGO_URI in .env and restart.");
    }
};
