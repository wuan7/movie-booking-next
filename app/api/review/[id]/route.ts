import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Lấy ID từ URL path
  if (!id)
    return NextResponse.json({ message: "Không tìm thấy id" }, { status: 400 });

  try {
    const reviews = await prisma.review.findMany({
      where: {
        movieId: id,
      },
      include: {
        user: true,
      },
    });

    
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy bình luận theo movieId:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy bình luận thoe movie id." },
      { status: 500 }
    );
  }
}
