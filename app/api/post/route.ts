import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";
import readingTime from "reading-time";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, imageUrl, categoryId, imagePublicId, creator } =
      body;

    if (
      !title ||
      !content ||
      !imageUrl ||
      !categoryId ||
      !imagePublicId ||
      !creator
    ) {
      return NextResponse.json({ message: "Thiếu thông tin" }, { status: 400 });
    }
    const randomSuffix = String(Math.floor(Math.random() * 1000000)).padStart(4, '0');
    const baseSlug = slugify(title, {
      locale: "vi",
      lower: true,
      strict: true,
    });
    const slug = `${baseSlug}-${randomSuffix}`;

    const plainText = content.replace(/<[^>]*>/g, " ");
    const stats = readingTime(plainText, { wordsPerMinute: 300 });
    const reading = Math.ceil(stats.minutes);
    const post = await prisma.article.create({
      data: {
        title,
        content,
        imageUrl,
        imagePublicId,
        postCategoryId: categoryId,
        slug,
        readingTime: reading,
        creator,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi tạo bài viết" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const posts = await prisma.article.findMany({
      include: { postCategory: true },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy danh sách bài viết" },
      { status: 500 }
    );
  }
}