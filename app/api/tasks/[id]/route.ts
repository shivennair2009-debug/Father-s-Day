import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    
    const stmt = db.prepare('UPDATE tasks SET status = ? WHERE id = ?');
    const info = stmt.run(status, id);
    
    if (info.changes === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const info = stmt.run(id);
    
    if (info.changes === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
