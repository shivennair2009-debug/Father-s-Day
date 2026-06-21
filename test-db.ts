import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { initDB } from './lib/db';

async function test() {
  try {
    console.log("Running initDB...");
    await initDB();
    console.log("initDB finished.");

    const id = uuidv4();
    console.log("Adding task with id", id);
    const res = await sql`
      INSERT INTO tasks (id, title, priority, category, status, type, difficulty, scheduled_time) 
      VALUES (${id}, 'Test Task', 'LOW', 'Quest', 'PENDING', 'ONE_OFF', 'EASY', null)
    `;
    console.log("Insert response:", res);
    
    const { rows } = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    console.log("Select response:", rows);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
