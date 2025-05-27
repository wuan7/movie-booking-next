import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");
    const roomId = searchParams.get("roomId");
    if (!brandId || !roomId) {
      return new NextResponse("Missing brandId or roomId", { status: 400 });
    }
    const rooms = await prisma.room.findMany({
      where: {
        id: roomId,
        brandId,
      },
      include: {
        rows: {
          include: {
            seats: true,
          },
        },
      },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ghế:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách ghế." },
      { status: 500 }
    );
  }
}
