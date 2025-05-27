import { MovieStatus } from "../../../../lib/generated/prisma";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");
    if (!statusParam)
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    const status =
      statusParam &&
      Object.values(MovieStatus).includes(statusParam as MovieStatus)
        ? (statusParam as MovieStatus)
        : undefined;

    const movies = await prisma.movie.findMany({
      where: {
        status,
    
      },
      include: {
        nation: true,
        castings: {
          include: {
            cast: true,
          },
        },
        genres: {
          include: {
            genre: true,
          },
        },
      },
      take: 10,
      orderBy: {
        releaseDate: "desc",
        
      },
    });

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy phim:", error);
    return NextResponse.json(
      { error: "Lấy phim thất bại", detail: error },
      { status: 500 }
    );
  }
}
