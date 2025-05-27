import { NextRequest, NextResponse } from 'next/server';
import redis from '../../../../lib/redis';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
    const showtimeId = searchParams.get("showtimeId");
  if (!showtimeId) {
    return NextResponse.json({ error: 'Missing showtimeId' }, { status: 400 });
  }

  const keys = await redis.keys(`seat:${showtimeId}:*`);
  const seatIds = keys.map((key) => key.split(':')[2]);

  return NextResponse.json({ heldSeatIds: seatIds });
}