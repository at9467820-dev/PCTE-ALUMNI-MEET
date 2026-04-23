import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'alumni.db');

const db = new Database(dbPath);

console.log("Seeding more database entries...");

const now = new Date().toISOString();
const pastDate1 = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
const pastDate2 = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
const pastDate3 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

// ======== ALUMNI 1 ========
const alumniId1 = randomUUID();
db.prepare(`
    INSERT INTO alumni (_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    alumniId1,
    "Sarah Smith",
    "https://ui-avatars.com/api/?name=Sarah+Smith&background=random&color=fff",
    "sarah.jpg",
    "2019",
    "https://linkedin.com/in/sarahsmith",
    "sarah@example.com",
    "Microsoft",
    "Cloud Architect",
    JSON.stringify([
      {year: "2019", company: "Accenture", role: "Software Engineer", location: "Bangalore"},
      {year: "2021", company: "Microsoft", role: "Cloud Architect", location: "Hyderabad"}
    ]),
    JSON.stringify(["Azure Certified Expert", "Best Mentor 2022"]),
    "The cloud is the limit. Keep learning every single day.",
    now,
    now
);

const meetId1 = randomUUID();
db.prepare(`
    INSERT INTO alumniMeets (_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, media_videoId, status, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    meetId1,
    "Mastering Azure Cloud Fundamentals",
    pastDate1,
    JSON.stringify(["BCA", "BTech"]),
    "IT Department",
    "Seminar Hall 1",
    JSON.stringify([alumniId1]),
    JSON.stringify([{image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", imageId: "img_azure"}]),
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "vid_azure",
    "Completed",
    "A deep dive into cloud architecture and how to successfully clear Azure certifications to land top jobs.",
    now,
    now
);

// ======== ALUMNI 2 ========
const alumniId2 = randomUUID();
db.prepare(`
    INSERT INTO alumni (_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    alumniId2,
    "Rajesh Kumar",
    "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=random&color=fff",
    "rajesh.jpg",
    "2016",
    "https://linkedin.com/in/rajeshk",
    "rajesh@example.com",
    "Netflix",
    "Senior Data Scientist",
    JSON.stringify([
      {year: "2016", company: "Infosys", role: "Data Analyst", location: "Pune"},
      {year: "2018", company: "Uber", role: "Data Scientist", location: "San Francisco"},
      {year: "2022", company: "Netflix", role: "Senior Data Scientist", location: "Los Gatos"}
    ]),
    JSON.stringify(["Built recommendation engines", "Published 3 research papers on ML"]),
    "Data tells a story if you listen closely enough.",
    now,
    now
);

const meetId2 = randomUUID();
db.prepare(`
    INSERT INTO alumniMeets (_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, media_videoId, status, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    meetId2,
    "Machine Learning at Netflix Scale",
    pastDate2,
    JSON.stringify(["MCA", "MSc IT"]),
    "AI/ML Club",
    "Main Auditorium",
    JSON.stringify([alumniId2]),
    JSON.stringify([{image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800", imageId: "img_netflix"}]),
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "vid_netflix",
    "Completed",
    "An exclusive walk-through of how Netflix uses big data and machine learning to build its world-class recommendation engine.",
    now,
    now
);

// ======== ALUMNI 3 ========
const alumniId3 = randomUUID();
db.prepare(`
    INSERT INTO alumni (_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    alumniId3,
    "Priya Sharma",
    "https://ui-avatars.com/api/?name=Priya+Sharma&background=random&color=fff",
    "priya.jpg",
    "2020",
    "https://linkedin.com/in/priyasharma",
    "priya@example.com",
    "Stripe",
    "Product Designer",
    JSON.stringify([
      {year: "2020", company: "Zomato", role: "UI/UX Designer", location: "Gurgaon"},
      {year: "2023", company: "Stripe", role: "Product Designer", location: "Remote"}
    ]),
    JSON.stringify(["Dribbble Top 100 Designer", "Led UI redesign for Zomato app"]),
    "Design is not just what it looks like, it's how it works.",
    now,
    now
);

const meetId3 = randomUUID();
db.prepare(`
    INSERT INTO alumniMeets (_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, media_videoId, status, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    meetId3,
    "Designing Interfaces that Convert",
    pastDate3,
    JSON.stringify(["BCA", "BBA"]),
    "Design Society",
    "Creative Studio 4",
    JSON.stringify([alumniId3]),
    JSON.stringify([{image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800", imageId: "img_design"}]),
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "vid_ui",
    "Completed",
    "A masterclass on UI/UX best practices, user psychology, and creating application interfaces that delight users.",
    now,
    now
);

console.log("3 new talks with videos added successfully! ✅");
