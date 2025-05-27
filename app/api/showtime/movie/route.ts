import { prisma } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { toZonedTime, format } from "date-fns-tz";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");
    const showDate = searchParams.get("showDate");

    if (!movieId || !showDate) {
      return NextResponse.json(
        { message: "Missing movieId or showDate" },
        { status: 400 }
      );
    }

    const now = new Date();

    // Chuyển đổi thời gian hiện tại sang múi giờ cụ thể (ví dụ: Asia/Ho_Chi_Minh)
    const nowInTimeZone = toZonedTime(now, "Asia/Ho_Chi_Minh");

    // Định dạng thời gian theo múi giờ để so sánh
    const formattedNow = format(nowInTimeZone, "yyyy-MM-dd HH:mm:ssXXX", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    // Chuyển đổi showDate thành thời gian UTC vào cuối ngày (23:59:59.999)
    const endOfDayInUTC = new Date(
      new Date(showDate).setHours(23, 59, 59, 999)
    );

    // Chuyển đổi showDate về múi giờ mong muốn
    const showtimeData = await prisma.showtime.findMany({
      where: {
        movieId,
        showDate: {
          gte: new Date(showDate), // Chỉ lấy showtime trong ngày (trước hoặc sau thời gian đó)
          lt: endOfDayInUTC, // Lọc thời gian trong ngày (chỉ lấy showtime trước 23:59)
        },
        startTime: {
          gt: new Date(formattedNow), // chỉ lấy showtime sau thời điểm hiện tại
        },
      },
      include: {
        brand: {
          include: {
            company: true,
          },
        },
      },

      orderBy: {
        startTime: "asc",
      },
    });

    const uniqueShowtimes = showtimeData.filter(
      (showtime, index, self) =>
        index === self.findIndex((s) => s.brandId === showtime.brandId)
    );

    return NextResponse.json(uniqueShowtimes);
  } catch (error) {
    console.error("[GET_SHOWTIMES]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
