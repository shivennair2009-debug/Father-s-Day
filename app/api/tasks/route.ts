import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, priority, category, type = 'ONE_OFF', difficulty = 'EASY', scheduled_time = null } = await request.json();
    const id = uuidv4();
    
    const stmt = db.prepare('INSERT INTO tasks (id, title, priority, category, type, difficulty, scheduled_time) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, title, priority, category, type, difficulty, scheduled_time);
    
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
