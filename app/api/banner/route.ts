import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { movieId, imageUrl, imagePublicId } = body;

    if (!movieId || !imageUrl || !imagePublicId) {
      return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        movieId,
        imageUrl,
        imagePublicId,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo banner:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo banner." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
        include: {
            movie: true,
        },
    });

    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách banners:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách banners." },
      { status: 500 }
    );
  }
}