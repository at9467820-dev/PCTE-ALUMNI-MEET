import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'alumni.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS alumni (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      profilePic TEXT NOT NULL DEFAULT '',
      fileName TEXT NOT NULL DEFAULT '',
      batch TEXT NOT NULL,
      linkedIn TEXT DEFAULT '',
      email TEXT UNIQUE NOT NULL,
      currentCompany TEXT NOT NULL,
      currentRole TEXT NOT NULL,
      careerTimeline TEXT NOT NULL DEFAULT '[]',
      achievements TEXT DEFAULT '[]',
      quote TEXT DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS alumniMeets (
      _id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      time TEXT NOT NULL,
      classJoined TEXT DEFAULT '[]',
      organizedBy TEXT NOT NULL,
      location TEXT NOT NULL,
      alumni TEXT NOT NULL DEFAULT '[]',
      media_images TEXT DEFAULT '[]',
      media_videoLink TEXT DEFAULT '',
      media_videoId TEXT DEFAULT '',
      status TEXT DEFAULT 'Upcoming',
      description TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      avatar_url TEXT DEFAULT '',
      avatar_public_id TEXT DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS blacklist (
      _id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      expiresAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS feedback (
      _id TEXT PRIMARY KEY,
      avatar TEXT DEFAULT '',
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      comment TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
  db.prepare("DELETE FROM blacklist WHERE datetime(expiresAt) < datetime('now')").run();
  console.log("SQLite database initialized successfully");
}

export default db;
