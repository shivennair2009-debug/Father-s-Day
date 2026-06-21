import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'novax.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    priority TEXT CHECK( priority IN ('LOW', 'MED', 'HIGH') ) NOT NULL,
    category TEXT,
    status TEXT CHECK( status IN ('PENDING', 'COMPLETED') ) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
