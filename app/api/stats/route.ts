import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = db.prepare("SELECT * FROM stats WHERE id = 'dad'").get();
    if (!stats) {
      db.prepare("INSERT INTO stats (id, total_xp, current_level) VALUES ('dad', 0, 1)").run();
      return NextResponse.json({ total_xp: 0, current_level: 1 });
    }
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
