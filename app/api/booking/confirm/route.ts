import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import redis from '../../../../lib/redis';

export async function POST(req: NextRequest) {
  const { holdId, showtimeId } = await req.json();

  if (!holdId || !showtimeId) {
    return NextResponse.json({ error: 'Missing holdId or showtimeId.' }, { status: 400 });
  }

  const redisKey = `hold:${showtimeId}:${holdId}`;
  const holdData = await redis.get(redisKey);

  if (!holdData) {
    return NextResponse.json({ error: 'Hold expired or not found.' }, { status: 404 });
  }

  const { userId, seatIds, totalPrice } = JSON.parse(holdData);

  try {
    const bookings = seatIds.map((seatId: string) => ({
      userId,
      seatId,
      showtimeId,
      price: totalPrice / seatIds.length,
    }));

    await prisma.$transaction(async (tx) => {
      await tx.booking.createMany({ data: bookings });
    });

    // ✅ Dọn Redis sau khi DB thành công
    const seatKeys = seatIds.map((seatId: string) => `seat:${showtimeId}:${seatId}`);
    await redis.del(redisKey, ...seatKeys);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to confirm booking.', details: err }, { status: 500 });
  }
}
