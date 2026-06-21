import { Pool } from 'pg';

// Initialize pool securely by parsing the URL manually to avoid SSL parameter overrides
const dbUrl = new URL(process.env.POSTGRES_URL || 'postgres://localhost:5432/postgres');
const pool = new Pool({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port || '5432'),
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export async function initDB() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        priority VARCHAR(50) NOT NULL,
        category VARCHAR(50),
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        type VARCHAR(50) DEFAULT 'ONE_OFF',
        difficulty VARCHAR(50) DEFAULT 'EASY',
        scheduled_time VARCHAR(50)
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS stats (
        id VARCHAR(255) PRIMARY KEY,
        total_xp INTEGER DEFAULT 0,
        current_level INTEGER DEFAULT 1
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS links (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        color VARCHAR(50) DEFAULT 'bg-white'
      );
    `);

    // Initialize dad stats if not exists
    const statCheck = await query(`SELECT * FROM stats WHERE id = 'dad'`);
    if (statCheck.rowCount === 0) {
      await query(`INSERT INTO stats (id, total_xp, current_level) VALUES ('dad', 0, 1)`);
    }
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}
