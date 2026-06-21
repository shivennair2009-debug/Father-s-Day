import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (body.status !== undefined) {
      const completedAt = body.status === 'COMPLETED' ? new Date().toISOString() : null;
      await query(
        `UPDATE watchlist SET status = $1, completed_at = $2 WHERE id = $3 RETURNING *`,
        [body.status, completedAt, id]
      );
    }
    
    if (body.rating !== undefined) {
      await query(
        `UPDATE watchlist SET rating = $1 WHERE id = $2 RETURNING *`,
        [body.rating, id]
      );
    }

    const { rows } = await query(`SELECT * FROM watchlist WHERE id = $1`, [id]);
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query(`DELETE FROM watchlist WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
