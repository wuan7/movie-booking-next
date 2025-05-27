// src/app/api/seats/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import redis from '../../../../lib/redis'

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: 'Thiếu userId' }, { status: 400 })
  }

  const heldSeatsKey = `held_seats:${userId}`
  const seatIds = await redis.smembers(heldSeatsKey)

  if (!seatIds.length) {
    return NextResponse.json({ error: 'Không có ghế nào được giữ.' }, { status: 400 })
  }

  // Lưu vào DB thật (giả lập ở đây)
  // await db.booking.insertMany(seatIds.map(seatId => ({ seatId, userId })))

  for (const seatId of seatIds) {
    await redis.del(`seat_lock:${seatId}`)
  }

  await redis.del(heldSeatsKey)

  return NextResponse.json({ success: true, bookedSeats: seatIds })
}
