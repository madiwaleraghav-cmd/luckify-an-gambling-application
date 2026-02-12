import Database from 'better-sqlite3';
import path from 'path';

// Use a singleton pattern to prevent multiple connections in dev
const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize tables if they don't exist
const initDb = () => {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      balance REAL DEFAULT 500.0,
      totalDeposited REAL DEFAULT 0.0,
      totalWon REAL DEFAULT 0.0,
      totalLost REAL DEFAULT 0.0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL, -- DEPOSIT, WITHDRAWAL, BET, WIN, BONUS
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
};

initDb();

export default db;
