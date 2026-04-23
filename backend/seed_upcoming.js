import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'alumni.db');

const db = new Database(dbPath);

console.log("Adding an upcoming event to test the schedule countdown...");

const now = new Date().toISOString();
// Schedule the event for strictly 36 hours from now
const futureDate = new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString();

const alumniId6 = randomUUID();
db.prepare(`
    INSERT INTO alumni (_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    alumniId6,
    "Sophia Patel",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    "sophia.jpg",
    "2021",
    "https://linkedin.com/in/sophiap",
    "sophia@example.com",
    "Google",
    "Product Manager",
    JSON.stringify([
      {year: "2021", company: "Amazon", role: "Associate PM", location: "Seattle"},
      {year: "2024", company: "Google", role: "Product Manager", location: "Remote"}
    ]),
    JSON.stringify(["Launched Google Maps feature", "Top PM award 2025"]),
    "Build products that genuinely help people.",
    now,
    now
);

const meetId6 = randomUUID();
db.prepare(`
    INSERT INTO alumniMeets (_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, media_videoId, status, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    meetId6,
    "Product Management 101: From Idea to Launch",
    futureDate,
    JSON.stringify(["BBA", "MBA"]),
    "Business Department",
    "Main Seminar Hall",
    JSON.stringify([alumniId6]),
    "[]",
    "",
    "",
    "Upcoming",
    "Join Sophia Patel as she shares her journey from college to becoming a PM at Google. Learn exactly how to build and launch products people love.",
    now,
    now
);

console.log("Upcoming event added successfully! 🚀");
