import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const links = db.prepare('SELECT * FROM links ORDER BY rowid ASC').all();
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, url, color = 'bg-white' } = await request.json();
    const id = uuidv4();
    
    // Auto-fix missing http/https prefix
    const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    
    const stmt = db.prepare('INSERT INTO links (id, title, url, color) VALUES (?, ?, ?, ?)');
    stmt.run(id, title, finalUrl, color);
    
    const newLink = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}
