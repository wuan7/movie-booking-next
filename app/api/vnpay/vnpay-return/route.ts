import { NextRequest, NextResponse } from "next/server";
import qs from "qs";
import crypto from "crypto";
import { prisma } from "../../../../lib/prisma";
import { VNPAY_CONFIG } from "../../../../config/vnpay";
import redis from "../../../../lib/redis";
import { pusherServer } from "../../../../lib/pusher-server";
const sortObject = (obj: Record<string, string>): Record<string, string> => {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, string>, key: string) => {
      result[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
      return result;
    }, {});
};

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const params = Object.fromEntries(url.searchParams.entries());

  const secureHash = params["vnp_SecureHash"];
  delete params["vnp_SecureHash"];
  delete params["vnp_SecureHashType"];

  const sortedParams = sortObject(params);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac("sha512", VNPAY_CONFIG.hashSecret);
  const signed = hmac.update(signData).digest("hex");

  if (secureHash !== signed) {
    return NextResponse.json(
      { message: "Sai chữ ký", success: false },
      { status: 400 }
    );
  }

  const responseCode = params["vnp_ResponseCode"];
  const holdIdAndShowtimeId = params["vnp_OrderInfo"];
  const [holdId, showtimeId] = holdIdAndShowtimeId.split("/");

  if (responseCode === "00") {
    try {
      const redisKey = `hold:${showtimeId}:${holdId}`;
      console.log("redisKey", redisKey);
      const holdData = await redis.get(redisKey);

      if (!holdData) {
        return NextResponse.json(
          {
            message: "Phiên giữ ghế đã hết hạn. Vui lòng đặt lại.",
            success: false,
          },
          { status: 410 }
        );
      }

      const { userId, seatIds, totalPrice } = JSON.parse(holdData);
      const orderId = Date.now().toString(); // bạn có thể thay thế bằng UUID hoặc từ Prisma DB

      // Đánh dấu ghế đã đặt
      const seatKeys = seatIds.map(
        (seatId: string) => `seat:${showtimeId}:${seatId}`
      );
      for (const seatKey of seatKeys) {
        await redis.set(
          seatKey,
          JSON.stringify({ status: "BOOKED", orderId, userId }),
          "EX",
          3600 * 24
        );
      }

      // Xóa phiên giữ
      await redis.del(redisKey);
      await pusherServer.trigger(
        `showtime-${showtimeId}`,
        "seat-status-changed",
        { seatIds, status: "BOOKED" }
      );
      const seats = await prisma.showtimeSeat.findMany({
        where: {
          id: { in: seatIds },
          status: { not: "BOOKED" },
        },
      });

      if (seats.length !== seatIds.length) {
        return NextResponse.json(
          { message: "Some seats are already booked" },
          { status: 409 }
        );
      }

      await prisma.showtimeSeat.updateMany({
        where: { id: { in: seatIds } },
        data: { status: "BOOKED" },
      });

      const booking = await prisma.booking.create({
        data: {
          userId,
          showtimeId,
          totalPrice,
        },
      });

      await prisma.ticket.createMany({
        data: seatIds.map((seatId: string) => ({
          showtimeSeatId: seatId,
          showtimeId,
          bookingId: booking.id,
          status: "PAID",
        })),
      });

      // Chuyển hướng về trang kết quả
      return NextResponse.redirect(`${VNPAY_CONFIG.returnUrl}`);
    } catch (error) {
      console.error("Lỗi transaction:", error);
      return NextResponse.json(
        { message: "Lỗi xử lý đặt vé", success: false },
        { status: 500 }
      );
    }
  } else {
    const redisKey = `hold:${showtimeId}:${holdId}`;
    const holdData = await redis.get(redisKey);

    if (!holdData) {
      return NextResponse.json(
        {
          message: "Phiên giữ ghế đã hết hạn. Vui lòng đặt lại.",
          success: false,
        },
        { status: 410 }
      );
    }

    const { seatIds } = JSON.parse(holdData);
    await prisma.showtimeSeat.updateMany({
      where: { id: { in: seatIds } },
      data: { status: "AVAILABLE" },
    });
    
    await pusherServer.trigger(
      `showtime-${showtimeId}`,
      "seat-status-changed",
      { seatIds, status: "AVAILABLE" }
    );
    await redis.del(redisKey);
    return NextResponse.redirect(`${VNPAY_CONFIG.returnUrl}?success=false`);
  }
}
