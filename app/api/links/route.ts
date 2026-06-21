import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { initDB, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDB();
    const { rows } = await query(`SELECT * FROM links ORDER BY title ASC`);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDB();
    const { title, url, color = 'bg-white' } = await request.json();
    const id = uuidv4();
    
    const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    
    await query(
      `INSERT INTO links (id, title, url, color) VALUES ($1, $2, $3, $4)`,
      [id, title, finalUrl, color]
    );
    
    const { rows } = await query(`SELECT * FROM links WHERE id = $1`, [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}
