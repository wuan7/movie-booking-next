import { NextRequest, NextResponse } from 'next/server'
import redis from '../../../../lib/redis'


export async function POST(req: NextRequest) {
  const { userId, seatIds } = await req.json()

  if (!userId || !seatIds || !Array.isArray(seatIds)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const heldSeatsKey = `held_seats:${userId}`
  const existingSeats = await redis.smembers(heldSeatsKey)

  if (existingSeats.length + seatIds.length > 7) {
    return NextResponse.json({ error: 'Chỉ được giữ tối đa 7 ghế.' }, { status: 400 })
  }

  for (const seatId of seatIds) {
    const lockKey = `seat_lock:${seatId}`
    const result = await redis.call('SET', lockKey, userId, 'NX', 'EX', 600);

    if (result !== 'OK') {
      return NextResponse.json({ error: `Ghế ${seatId} đã có người giữ.` }, { status: 409 })
    }

    await redis.sadd(heldSeatsKey, seatId)
  }

  await redis.expire(heldSeatsKey, 600) // Danh sách ghế cũng hết hạn

  return NextResponse.json({ success: true })
}