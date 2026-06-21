import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'novax.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    priority TEXT CHECK( priority IN ('LOW', 'MED', 'HIGH', 'VERY_HIGH') ) NOT NULL,
    category TEXT,
    status TEXT CHECK( status IN ('PENDING', 'COMPLETED') ) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    type TEXT DEFAULT 'ONE_OFF',
    difficulty TEXT DEFAULT 'EASY',
    scheduled_time TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS stats (
    id TEXT PRIMARY KEY,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    color TEXT DEFAULT 'bg-white'
  )
`);

// Initialize dad stats if not exists
const statCheck = db.prepare("SELECT * FROM stats WHERE id = 'dad'").get();
if (!statCheck) {
  db.prepare("INSERT INTO stats (id, total_xp, current_level) VALUES ('dad', 0, 1)").run();
}

try { db.exec("ALTER TABLE tasks ADD COLUMN type TEXT DEFAULT 'ONE_OFF'"); } catch (e) {}
try { db.exec("ALTER TABLE tasks ADD COLUMN difficulty TEXT DEFAULT 'EASY'"); } catch (e) {}
try { db.exec("ALTER TABLE tasks ADD COLUMN scheduled_time TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE tasks ADD COLUMN completed_at DATETIME"); } catch (e) {}

export default db;
