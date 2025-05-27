import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, imageUrl, imagePublicId, description } = body;

    if (!name || !description || !imageUrl || !imagePublicId) {
      return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        name,
        description,
        imageUrl,
        imagePublicId,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo company:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo company." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const companies = await prisma.company.findMany();

    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách companies:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách companies." },
      { status: 500 }
    );
  }
}
