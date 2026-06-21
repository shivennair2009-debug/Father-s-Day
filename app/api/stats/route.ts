import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { initDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDB();
    const { rows } = await sql`SELECT * FROM stats WHERE id = 'dad'`;
    if (rows.length === 0) {
      return NextResponse.json({ total_xp: 0, current_level: 1 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
