import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, brandId, description, totalSeats, roomType } = body;

    if (!name || !brandId || !description || !totalSeats || !roomType) {
      return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 400 });
    }

    const room = await prisma.room.create({
      data: {
        name,
        brandId,
        description,
        totalSeats: Number(totalSeats),
        roomType
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
    const rooms = await prisma.room.findMany();

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách rooms:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách rooms." },
      { status: 500 }
    );
  }
}
