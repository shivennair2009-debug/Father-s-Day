const { Pool } = require('pg');

async function test() {
  try {
    let connectionString = process.env.POSTGRES_URL || '';
    if (connectionString.includes('?')) {
      connectionString = connectionString.split('?')[0];
    }
    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
    const res = await pool.query('SELECT 1 as val');
    console.log("Success with split:", res.rows);
    pool.end();
  } catch (e) {
    console.error("Failed:", e.message);
  }
}
test();
