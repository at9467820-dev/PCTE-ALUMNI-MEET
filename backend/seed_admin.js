import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'alumni.db');

const db = new Database(dbPath);

async function seedAdmin() {
  const email = 'admin@pcte.edu';
  const password = 'admin1234';
  const name = 'Admin';
  
  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existing) {
    console.log('Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const _id = randomUUID();
  const now = new Date().toISOString();
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true&rounded=true`;

  db.prepare(`INSERT INTO users (_id, name, email, password, avatar_url, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    _id, name, email.toLowerCase(), hashedPassword, avatarUrl, now, now
  );

  console.log('Admin user created successfully');
}

seedAdmin().catch(console.error);
