import { NextRequest, NextResponse } from "next/server";
import { Seat } from "@/lib/generated/prisma";
import { prisma } from "../../../lib/prisma";
import { RowWithSeats } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const {
      movieId,
      companyId,
      brandId,
      roomId,
      startTime,
      endTime,
      showDate,
      seatPrices,
    } = await req.json();

    if (
      !movieId ||
      !companyId ||
      !brandId ||
      !roomId ||
      !startTime ||
      !endTime ||
      !showDate
    ) {
      return NextResponse.json(
        { message: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Lấy thông tin Room cùng với Rows và Seats
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        rows: {
          include: {
            seats: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { message: "Không tìm thấy phòng chiếu" },
        { status: 404 }
      );
    }

    const sortedRows = room.rows.sort((a, b) => {
  return a.rowNumber - b.rowNumber;
});

const showtimeRowsData = sortedRows.map((row: RowWithSeats) => {
  const sortedSeats = row.seats.sort((a, b) => {
  return parseInt(a.rowName) - parseInt(b.rowName);
});

  return {
    rowName: row.rowName,
    seats: {
      create: sortedSeats.map((seat: Seat) => ({
        seatCode: seat.seatCode,
        seatNumber: seat.rowName, // hoặc seat.seatNumber nếu có
        seatType: seat.seatType,
        centerType: seat.centerType,
        status: "AVAILABLE",
      })),
    },
  };
});
const inputDate = new Date(showDate); 

// Tạo lại Date mới theo UTC lúc 0h ngày đó
const showDateUTC = new Date(Date.UTC(
  inputDate.getFullYear(),
  inputDate.getMonth(),
  inputDate.getDate()
));
    // Tạo suất chiếu kèm seatPrices và rows
    const showtime = await prisma.showtime.create({
      data: {
        movieId,
        companyId,
        brandId,
        roomId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        showDate: showDateUTC,
        seatPrices: {
          create: seatPrices.map(
            (price: { seatType: string; price: number }) => ({
              seatType: price.seatType,
              price: price.price,
            })
          ),
        },
        rows: {
          create: showtimeRowsData,
        },
      },
      include: {
        seatPrices: true,
        rows: {
          include: {
            seats: true,
          },
        },
      },
    });

    return NextResponse.json({ showtime }, { status: 201 });
  } catch (error) {
    console.error("Error creating showtime:", error);
    return NextResponse.json(
      { message: "Lỗi tạo suất chiếu" },
      { status: 500 }
    );
  }
}
