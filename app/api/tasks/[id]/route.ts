import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    
    // Get existing task to check difficulty
    const { rows: existingRows } = await sql`SELECT status, difficulty FROM tasks WHERE id = ${id}`;
    const existing = existingRows[0];
    
    if (!existing) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const completedAt = status === 'COMPLETED' ? new Date().toISOString() : null;
    
    await sql`
      UPDATE tasks 
      SET status = ${status}, completed_at = ${completedAt} 
      WHERE id = ${id}
    `;

    // Award XP if changing to COMPLETED
    if (status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      let xpAward = 10;
      if (existing.difficulty === 'MED') xpAward = 25;
      if (existing.difficulty === 'HIGH') xpAward = 50;

      await sql`
        UPDATE stats 
        SET total_xp = total_xp + ${xpAward},
            current_level = (total_xp + ${xpAward}) / 100 + 1
        WHERE id = 'dad'
      `;
    }
    
    const { rows: updatedRows } = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    return NextResponse.json(updatedRows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const result = await sql`DELETE FROM tasks WHERE id = ${id}`;
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
