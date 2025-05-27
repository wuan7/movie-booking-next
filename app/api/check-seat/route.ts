import { NextResponse } from 'next/server';
import redis from '../../../lib/redis';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { showtimeId, seatId } = body;

    if (!showtimeId || !seatId) {
      return NextResponse.json({ message: 'Thiếu thông tin' }, { status: 400 });
    }

    const redisKey = `hold:${showtimeId}:${seatId}`;
    const holder = await redis.get(redisKey);

    return NextResponse.json({ isHeld: !!holder, holder });
  } catch (error) {
    console.error('Lỗi kiểm tra ghế:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}