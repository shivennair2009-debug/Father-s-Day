import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { initDB, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDB();
    const { rows } = await query(`SELECT * FROM watchlist ORDER BY created_at DESC`);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch watchlist', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDB();
    const { title, type, platform } = await request.json();
    const id = uuidv4();
    
    await query(
      `INSERT INTO watchlist (id, title, type, platform, status, rating) 
       VALUES ($1, $2, $3, $4, 'PENDING', 0)`,
      [id, title, type, platform]
    );
    
    const { rows } = await query(`SELECT * FROM watchlist WHERE id = $1`, [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create watchlist item', details: String(error) }, { status: 500 });
  }
}
