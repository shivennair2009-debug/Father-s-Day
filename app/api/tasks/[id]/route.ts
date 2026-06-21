import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    
    // Get existing task to check difficulty
    const existing = db.prepare('SELECT status, difficulty FROM tasks WHERE id = ?').get(id) as any;
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const completedAt = status === 'COMPLETED' ? new Date().toISOString() : null;
    const stmt = db.prepare('UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?');
    stmt.run(status, completedAt, id);

    // Award XP if changing from PENDING to COMPLETED
    if (existing.status === 'PENDING' && status === 'COMPLETED') {
      const xpReward = existing.difficulty === 'HARD' ? 50 : existing.difficulty === 'MEDIUM' ? 25 : 10;
      
      const stats = db.prepare("SELECT * FROM stats WHERE id = 'dad'").get() as any;
      const newXp = stats.total_xp + xpReward;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      db.prepare("UPDATE stats SET total_xp = ?, current_level = ? WHERE id = 'dad'").run(newXp, newLevel);
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
