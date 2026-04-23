import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'alumni.db');

const db = new Database(dbPath);

console.log("Seeding awesome new alumni with real DP pictures...");

const now = new Date().toISOString();
const pastDate1 = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString();
const pastDate2 = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

// ======== ALUMNI 4 (Real Picture) ========
const alumniId4 = randomUUID();
db.prepare(`
    INSERT INTO alumni (_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    alumniId4,
    "Emily Chen",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    "emily_dp.jpg",
    "2017",
    "https://linkedin.com/in/emilychen",
    "emily@example.com",
    "OpenAI",
    "AI Research Scientist",
    JSON.stringify([
      {year: "2017", company: "IBM", role: "Software Engineer", location: "New York"},
      {year: "2020", company: "Google", role: "Machine Learning Engineer", location: "Mountain View"},
      {year: "2023", company: "OpenAI", role: "AI Research Scientist", location: "San Francisco"}
    ]),
    JSON.stringify(["Contributed to GPT-4 development", "Speaker at NeurIPS"]),
    "Artificial intelligence is the next major step in human evolution. Build it responsibly.",
    now,
    now
);

const meetId4 = randomUUID();
db.prepare(`
    INSERT INTO alumniMeets (_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, media_videoId, status, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    meetId4,
    "The Future of Generative AI",
    pastDate1,
    JSON.stringify(["BCA", "BTech", "MCA"]),
    "Computer Science Dept",
    "Virtual Webinar",
    JSON.stringify([alumniId4]),
    JSON.stringify([{image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", imageId: "img_ai"}]),
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "vid_sintel",
    "Completed",
    "An eye-opening discussion about Large Language Models, Generative AI possibilities, and where the industry is heading in the next 10 years.",
    now,
    now
);

// ======== ALUMNI 5 (Real Picture) ========
const alumniId5 = randomUUID();
db.prepare(`
    INSERT INTO alumni (_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    alumniId5,
    "David Reynolds",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    "david_dp.jpg",
    "2015",
    "https://linkedin.com/in/davidreynolds",
    "david@example.com",
    "CrowdStrike",
    "Cybersecurity Specialist",
    JSON.stringify([
      {year: "2015", company: "Cisco", role: "Network Engineer", location: "Austin"},
      {year: "2018", company: "CrowdStrike", role: "Cybersecurity Specialist", location: "Remote"}
    ]),
    JSON.stringify(["Certified Ethical Hacker (CEH)", "Secured fortune 500 company infrastructure"]),
    "In cybersecurity, being paranoid is just part of the job description.",
    now,
    now
);

const meetId5 = randomUUID();
db.prepare(`
    INSERT INTO alumniMeets (_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, media_videoId, status, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    meetId5,
    "Defending Against Modern Cyber Threats",
    pastDate2,
    JSON.stringify(["BTech CS", "MCA"]),
    "Cyber Security Club",
    "Block B Auditorium",
    JSON.stringify([alumniId5]),
    JSON.stringify([{image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800", imageId: "img_cyber"}]),
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "vid_tears",
    "Completed",
    "A thrilling session covering real-time threat hunting, ethical hacking, and how to start a career in defensive cybersecurity.",
    now,
    now
);

console.log("2 more realistic profiles with real DP pictures and working HTTPS videos added! 🎉");
