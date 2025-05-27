import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { seatCode, rowName, rowId, seatType, centerType } = body;

    if (!seatCode || !rowName || !rowId || !seatType || !centerType) {
      return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 400 });
    }

    const seat = await prisma.seat.create({
      data: {
        rowName,
        rowId,
        seatCode,
        seatType,
        centerType
      },
    });

    return NextResponse.json(seat, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo ghế:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo ghế." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const seats = await prisma.seat.findMany();

    return NextResponse.json(seats, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách seats:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách seats." },
      { status: 500 }
    );
  }
}
