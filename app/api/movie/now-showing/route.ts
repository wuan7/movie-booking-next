import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const excludeId = id ? id : undefined;
    const movies = await prisma.movie.findMany({
      where: {
        status: "NOW_SHOWING",
        NOT: {
          id: excludeId || undefined,
        },
      },
      include: {
        nation: true,
        castings: {
            include: {
                cast: true
            },
        },
        genres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: {
        releaseDate: "desc",
      },
      take: 10,
    });

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy phim đang chiếu:", error);
    return NextResponse.json(
      { error: "Lấy phim thất bại", detail: error },
      { status: 500 }
    );
  }
}
