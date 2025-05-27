import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, imageUrl} = body;

    if (!name || !imageUrl ) {
      return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 400 });
    }

    const brand = await prisma.cast.create({
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo cast:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo cast." },
      { status: 500 }
    );
  }
}
