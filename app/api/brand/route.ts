import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, companyId, address } = body;

    if (!name || !address || !companyId) {
      return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 400 });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        address,
        companyId
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo brand:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo brand." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const brands = await prisma.brand.findMany();

    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách brands:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách brands." },
      { status: 500 }
    );
  }
}
