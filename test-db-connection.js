const { Pool } = require('pg');

async function test() {
  try {
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
    const res = await pool.query('SELECT 1 as val');
    console.log("Success with URL parsing:", res.rows);
    pool.end();
  } catch (e) {
    console.error("Failed:", e.message);
  }
}
test();
