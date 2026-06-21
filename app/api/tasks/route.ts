import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { initDB, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDB();
    const { rows } = await query(`SELECT * FROM tasks ORDER BY created_at DESC`);
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
    
    await query(
      `INSERT INTO tasks (id, title, priority, category, status, type, difficulty, scheduled_time) 
       VALUES ($1, $2, $3, $4, 'PENDING', $5, $6, $7)`,
      [id, title, priority, category, type, difficulty, scheduled_time]
    );
    
    const { rows } = await query(`SELECT * FROM tasks WHERE id = $1`, [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
