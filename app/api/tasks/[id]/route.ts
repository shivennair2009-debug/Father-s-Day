import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    
    const { rows: existingRows } = await query(`SELECT status, difficulty FROM tasks WHERE id = $1`, [id]);
    const existing = existingRows[0];
    
    if (!existing) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const completedAt = status === 'COMPLETED' ? new Date().toISOString() : null;
    
    await query(
      `UPDATE tasks SET status = $1, completed_at = $2 WHERE id = $3`,
      [status, completedAt, id]
    );

    if (status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      let xpAward = 10;
      if (existing.difficulty === 'MED') xpAward = 25;
      if (existing.difficulty === 'HIGH') xpAward = 50;

      await query(
        `UPDATE stats SET total_xp = total_xp + $1, current_level = (total_xp + $1) / 100 + 1 WHERE id = 'dad'`,
        [xpAward]
      );
    }
    
    const { rows: updatedRows } = await query(`SELECT * FROM tasks WHERE id = $1`, [id]);
    return NextResponse.json(updatedRows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await query(`DELETE FROM tasks WHERE id = $1`, [id]);
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
