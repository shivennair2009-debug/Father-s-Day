const { Pool } = require('pg');

async function test() {
  try {
    const pool = new Pool({
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      port: 5432,
      ssl: {
        rejectUnauthorized: false
      }
    });
    const res = await pool.query('SELECT 1 as val');
    console.log("Success with individual vars:", res.rows);
    pool.end();
  } catch (e) {
    console.error("Failed:", e.message);
  }
}
test();
