import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { initDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDB(); // Ensure tables exist
    const { rows } = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDB();
    const { title, priority, category, type = 'ONE_OFF', difficulty = 'EASY', scheduled_time = null } = await request.json();
    const id = uuidv4();
    
    await sql`
      INSERT INTO tasks (id, title, priority, category, status, type, difficulty, scheduled_time) 
      VALUES (${id}, ${title}, ${priority}, ${category}, 'PENDING', ${type}, ${difficulty}, ${scheduled_time})
    `;
    
    const { rows } = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
