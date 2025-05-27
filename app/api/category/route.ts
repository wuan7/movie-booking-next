import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";
import removeAccents from "remove-accents";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 400 });
    }
    const randomSuffix = String(Math.floor(Math.random() * 1000000)).padStart(4, '0');
    const slugGenre = slugify(name, {
      lower: true,
      locale: "vi",
      strict: true,
    });
    const slug = `${slugGenre}-${randomSuffix}`;
    const removeAccentsName = removeAccents(name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
    const category = await prisma.postCategory.create({
      data: {
        name,
        slug,
        nameUnsigned: removeAccentsName,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo danh mục." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.postCategory.findMany();

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách danh mục." },
      { status: 500 }
    );
  }
}
