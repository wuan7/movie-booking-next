import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Lấy ID từ URL path
  if (!id)
    return NextResponse.json({ message: "Không tìm thấy id" }, { status: 400 });

  try {
    const showtime = await prisma.showtime.findFirst({
      where: {
        id,
      },
      include: {
        rows: {
          include: {
            seats: true,
          },
        },
        seatPrices: true,
        brand: {
          include: {
            company: true,
          },
        },
        movie: true,
        room: true,
      },
    });

    if (!showtime)
      return NextResponse.json({ message: "Không tìm thấy suất chiếu" }, { status: 404 });

    // 👉 Sắp xếp ghế theo số thứ tự (rowName dạng chuỗi nhưng là số)
    const sortedRows = showtime.rows.map((row) => ({
      ...row,
      seats: row.seats.sort(
        (a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber)
      ),
    }));

    const sortedShowtime = {
      ...showtime,
      rows: sortedRows,
    };

    return NextResponse.json(sortedShowtime, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy phim theo id:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy phim theo id." },
      { status: 500 }
    );
  }
}
