import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
 const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Lấy ID từ URL path
  if (!id)
    return NextResponse.json({ message: "Không tìm thấy id" }, { status: 400 });
  try {
    const rows = await prisma.row.findMany({
      where: {
        roomId: id,
      },
    });

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách rows:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách rows." },
      { status: 500 }
    );
  }
}