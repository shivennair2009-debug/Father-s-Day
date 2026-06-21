import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { initDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDB();
    // Using created_at for ordering is standard for postgres, assuming we added it or just ordering by id. We can order by title for links.
    const { rows } = await sql`SELECT * FROM links ORDER BY title ASC`;
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
    
    // Auto-fix missing http/https prefix
    const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    
    await sql`
      INSERT INTO links (id, title, url, color) 
      VALUES (${id}, ${title}, ${finalUrl}, ${color})
    `;
    
    const { rows } = await sql`SELECT * FROM links WHERE id = ${id}`;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}
