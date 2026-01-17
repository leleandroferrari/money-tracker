import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'finance.db');
const db = new Database(dbPath);

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT,
    is_recurring INTEGER DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    budget REAL
  );
`);

export default db;
