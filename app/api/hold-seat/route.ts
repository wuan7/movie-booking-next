import { NextResponse } from 'next/server';
import redis from '../../../lib/redis';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { showtimeId, seatId, userId } = body;

    if (!showtimeId || !seatId || !userId) {
      return NextResponse.json({ message: 'Thiếu thông tin' }, { status: 400 });
    }

    const redisKey = `hold:${showtimeId}:${seatId}`;
    const currentHolder = await redis.get(redisKey);

    if (currentHolder && currentHolder !== userId) {
      return NextResponse.json({ message: 'Ghế đang được giữ bởi người khác' }, { status: 409 });
    }

    // Set TTL = 600 giây (10 phút)
    await redis.set(redisKey, userId, 'EX', 600);

    return NextResponse.json({ message: 'Giữ ghế thành công' });
  } catch (error) {
    console.error('Lỗi giữ ghế:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}