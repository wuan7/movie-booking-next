import { NextResponse } from 'next/server';
import redis from '../../../lib/redis';
//huy giu ghe
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { showtimeId, seatId, userId } = body;

    if (!showtimeId || !seatId || !userId) {
      return NextResponse.json({ message: 'Thiếu thông tin' }, { status: 400 });
    }

    const redisKey = `hold:${showtimeId}:${seatId}`;
    const currentHolder = await redis.get(redisKey);

    if (currentHolder !== userId) {
      return NextResponse.json({ message: 'Không thể hủy vì bạn không giữ ghế này' }, { status: 403 });
    }

    await redis.del(redisKey);
    return NextResponse.json({ message: 'Hủy giữ ghế thành công' });
  } catch (error) {
    console.error('Lỗi hủy giữ ghế:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}