import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'alumni.db');

const db = new Database(dbPath);

console.log("Seeding database...");

const alumniId = randomUUID();
const now = new Date().toISOString();
const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

db.prepare(`
    INSERT INTO alumni (_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    alumniId,
    "John Doe",
    "https://ui-avatars.com/api/?name=John+Doe&background=random",
    "profile.jpg",
    "2018",
    "https://linkedin.com/in/johndoe",
    "johndoe@example.com",
    "Google",
    "Senior Engineer",
    JSON.stringify([{year: "2018", company: "Amazon", role: "SDE", location: "Seattle"}]),
    JSON.stringify(["Employee of the year"]),
    "Keep pushing forward.",
    now,
    now
);

const meetId = randomUUID();
db.prepare(`
    INSERT INTO alumniMeets (_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, media_videoId, status, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    meetId,
    "Tech Trends & AI in 2025",
    pastDate,
    JSON.stringify(["BCA", "MCA"]),
    "CS Department",
    "Main Auditorium",
    JSON.stringify([alumniId]),
    JSON.stringify([{image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800", imageId: "img1"}]),
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "vid1",
    "Completed",
    "A great session discussing the rise of AI and its impact on the tech industry.",
    now,
    now
);

console.log("Database seeded successfully!");
