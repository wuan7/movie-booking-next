import { NextRequest, NextResponse } from "next/server";
import redis from "../../../../lib/redis";
import { v4 as uuidv4 } from "uuid";
import { pusherServer } from "../../../../lib/pusher-server";
import { seatQueue } from "../../../../lib/seatQueue";

const luaHoldSeats = `
  for i=1,#KEYS do
    if redis.call('exists', KEYS[i]) == 1 then
      return 0
    end
  end
  for i=1,#KEYS do
    redis.call('set', KEYS[i], ARGV[1], 'EX', 720)
  end
  redis.call('set', ARGV[2], ARGV[3], 'EX', 720)
  return 1
`;

export async function POST(req: NextRequest) {
  try {
    const { userId, showtimeId, seatIds, totalPrice } = await req.json();

    if (!userId || !showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return NextResponse.json({ error: "Thiếu dữ liệu hoặc dữ liệu không hợp lệ" }, { status: 400 });
    }

    const holdId = uuidv4();
    const redisKey = `hold:${showtimeId}:${holdId}`;
    const seatKeys = seatIds.map((seatId: string) => `seat:${showtimeId}:${seatId}`);

    const holdData = JSON.stringify({ userId, seatIds, totalPrice });

    const result = await redis.eval(luaHoldSeats, seatKeys.length, ...seatKeys, holdId, redisKey, holdData);

    if (result === 0) {
      return NextResponse.json({ error: "Một số ghế đã bị giữ rồi." }, { status: 409 });
    }
    await seatQueue.add(
      "release-seat",
      { userId, showtimeId, seatIds, holdId },
      { delay: 11 * 60 * 1000 }
    );
    // Push realtime event cập nhật trạng thái ghế
    await pusherServer.trigger(`showtime-${showtimeId}`, "seat-status-changed", {
      seatIds,
      status: "HELD",
      holdId,
      userId,
    });

    return NextResponse.json({ amount: totalPrice, orderId: holdId }, { status: 200 });
  } catch (error) {
    console.error("Lỗi giữ ghế:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
