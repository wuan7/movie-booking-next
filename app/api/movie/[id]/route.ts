import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Lấy ID từ URL path
  if (!id)
    return NextResponse.json({ message: "Không tìm thấy id" }, { status: 400 });
  try {
    const movie = await prisma.movie.findFirst({
      where: {
        slug: id,
      },
      include: {
        nation: true,
        genres: {
          include: {
            genre: true,
          },
        },
        castings: {
          include: {
            cast: true,
          },
        },
      },
    });

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy phim theo id:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy phim theo id." },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Lấy ID từ URL path
  if (!id)
    return NextResponse.json({ message: "Không tìm thấy id" }, { status: 400 });
  try {
    await prisma.movieGenre.deleteMany({
      where: {
        movieId: id,
      },
    });
    const movie = await prisma.movie.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xoá phim theo id:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi xoá phim theo id." },
      { status: 500 }
    );
  }
}
