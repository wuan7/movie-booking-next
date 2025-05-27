import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";
import removeAccents from "remove-accents";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      imageUrl,
      imagePublicId,
      trailerUrl,
      status,
      releaseDate,
      duration,
      ageRating,
      nationId,
      genres,
      director,
      casts
    } = body;

    if (
      !title ||
      !description ||
      !imageUrl ||
      !imagePublicId ||
      !trailerUrl ||
      !status ||
      !releaseDate ||
      !duration ||
      !ageRating ||
      !nationId ||
      !genres ||
      !director || 
      !casts
    ) {
      return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 400 });
    }
    const randomSuffix = String(Math.floor(Math.random() * 1000000)).padStart(4, '0');
    const slugMovie = slugify(title, {
      lower: true,
      locale: "vi",
      strict: true,
    });
    const slug = `${slugMovie}-${randomSuffix}`;
    const removeAccentsName = removeAccents(title)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
     
    const movie = await prisma.movie.create({
      data: {
        title,
        slug,
        nameUnsigned: removeAccentsName,
        description,
        imageUrl,
        imagePublicId,
        trailerUrl,
        status,
        releaseDate: new Date(releaseDate),
        duration: Number(duration),
        ageRating,
        nationId,
        genres: {
          create: genres.map((genreId: string) => ({
            genre: {
              connect: { id: genreId },
            },
          })),
        },
        director,
       castings: {
  create: casts.map((cast: { name: string; imageUrl: string }) => ({
    cast: {
      create: {
        name: cast.name,
        imageUrl: cast.imageUrl,
      },
    },
  })),
}
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo phim:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo phim." },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
    });
    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách phim." },
      { status: 500 }
    );
  }
}

