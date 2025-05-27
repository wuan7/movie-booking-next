import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rowNumber, rowName, roomId } = body;

    if (!rowNumber || !rowName || !roomId) {
      return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 400 });
    }

    const room = await prisma.row.create({
      data: {
        rowName,
        roomId,
        rowNumber: Number(rowNumber),
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo phòng chiếu:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo phòng chiếu." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rooms = await prisma.row.findMany();

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách row:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách row." },
      { status: 500 }
    );
  }
}
