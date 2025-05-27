import { MovieStatus } from "../../../../lib/generated/prisma";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const genre = searchParams.get("genre") || undefined;
    const statusParam = searchParams.get("status") || undefined;
    const nation = searchParams.get("nation") || undefined;

    const skip = (page - 1) * limit;

    // ✅ Ép kiểu status nếu hợp lệ
    const status = statusParam && Object.values(MovieStatus).includes(statusParam as MovieStatus)
      ? (statusParam as MovieStatus)
      : undefined;

    const whereCondition = {
      ...(genre && genre !== "default" && {
        genres: {
          some: {
            genre: {
              name: genre,
            },
          },
        },
      }),
      ...(nation && nation !== "default" && {
        nation: {
          name: nation,
        },
      }),
      ...(status && { status }),
      
    };

    const [movies, totalCount] = await Promise.all([
      prisma.movie.findMany({
        skip,
        take: limit,
        where: whereCondition,
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
          nation: true,
          castings: {
            include: {
              cast: true,
            },
          },
        },
      }),
      prisma.movie.count({
        where: whereCondition,
      }),
    ]);

    return NextResponse.json({
      movies,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách phim." },
      { status: 500 }
    );
  }
}
