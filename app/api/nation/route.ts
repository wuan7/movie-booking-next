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
    const randomSuffix = Math.random().toString(36).substring(2, 7);
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
    const company = await prisma.nation.create({
      data: {
        name,
        slug,
        nameUnsigned: removeAccentsName,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo quốc gia:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo quốc gia." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const nations = await prisma.nation.findMany();

    return NextResponse.json(nations, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách quốc gia:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách quốc gia." },
      { status: 500 }
    );
  }
}
