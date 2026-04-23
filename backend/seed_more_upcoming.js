import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'alumni.db');

const db = new Database(dbPath);

console.log("Adding 3 NEW upcoming events to the roster...");

const now = new Date().toISOString();

// Dates in the future for upcoming talks (e.g. +3 Days, +7 Days, +14 Days)
const futureDate1 = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
const futureDate2 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
const futureDate3 = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

// Seed Alumni Data
const alumniId1 = randomUUID();
const alumniId2 = randomUUID();
const alumniId3 = randomUUID();

// 1. Alex
db.prepare(`
    INSERT INTO alumni (_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    alumniId1,
    "Alex Mercer",
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    "alex.jpg",
    "2018",
    "https://linkedin.com/in/alexm",
    "alex.m@example.com",
    "Meta",
    "Senior Frontend Engineer",
    JSON.stringify([{year: "2018", company: "StartupInc", role: "Dev", location: "Remote"}, {year: "2021", company: "Meta", role: "Frontend Eng", location: "Menlo Park"}]),
    JSON.stringify(["Led React Core internal migration", "Open-source contributor"]),
    "Build UIs that matter.",
    now,
    now
);

// 2. Maya
db.prepare(`
    INSERT INTO alumni (_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    alumniId2,
    "Maya Rosalind",
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    "maya.jpg",
    "2016",
    "https://linkedin.com/in/mayar",
    "maya@example.com",
    "Spotify",
    "Data Scientist",
    JSON.stringify([{year: "2016", company: "AnalyticsCo", role: "Analyst", location: "NY"}, {year: "2020", company: "Spotify", role: "Data Scientist", location: "Stockholm"}]),
    JSON.stringify(["Built algorithmic playlist engine v2", "Data Speaker 2024"]),
    "Data without insight is just noise.",
    now,
    now
);

// 3. Marcus
db.prepare(`
    INSERT INTO alumni (_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    alumniId3,
    "Marcus Wong",
    "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    "marcus.jpg",
    "2020",
    "https://linkedin.com/in/marcusw",
    "marcus.wong@example.com",
    "Tesla",
    "Robotics Engineer",
    JSON.stringify([{year: "2020", company: "Tesla", role: "Robotics Engineer", location: "Austin"}]),
    JSON.stringify(["Developed automated QA factory line", "Robotics Hackathon Winner"]),
    "Automate the mundane, create the impossible.",
    now,
    now
);

// Seed Meet Data
const meetId1 = randomUUID();
const meetId2 = randomUUID();
const meetId3 = randomUUID();

db.prepare(`
    INSERT INTO alumniMeets (_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, media_videoId, status, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    meetId1,
    "Mastering Modern React & State Management",
    futureDate1,
    JSON.stringify(["CS", "IT"]),
    "Computer Science Dept",
    "Computing Lab A",
    JSON.stringify([alumniId1]),
    "[]", "", "", "Upcoming",
    "Dive deep into advanced React performance optimization, hooks, and modern frontend architectures with Alex Mercer from Meta.",
    now, now
);

db.prepare(`
    INSERT INTO alumniMeets (_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, media_videoId, status, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    meetId2,
    "The Future of AI in Music Selection",
    futureDate2,
    JSON.stringify(["MCA", "BTech"]),
    "AI & Data Science Club",
    "Virtual (Zoom)",
    JSON.stringify([alumniId2]),
    "[]", "", "", "Upcoming",
    "Discover how Spotify uses big data and neural networks to predict exactly what song you want to hear next, led by Sr. Data Scientist Maya.",
    now, now
);

db.prepare(`
    INSERT INTO alumniMeets (_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, media_videoId, status, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    meetId3,
    "Building Automation: Robotics in Production",
    futureDate3,
    JSON.stringify(["Mechanical", "CS"]),
    "Engineering Society",
    "Main Auditorium",
    JSON.stringify([alumniId3]),
    "[]", "", "", "Upcoming",
    "Marcus Wong shares his cutting-edge experiences developing factory line robotics at Tesla's Gigafactory.",
    now, now
);

console.log("3 new exciting upcoming events have been successfully seeded! 🎉");
