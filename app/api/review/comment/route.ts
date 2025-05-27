import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // chỉnh path tùy dự án
import { auth } from "../../../../auth";
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { movieId } = await req.json();

    if (!movieId) {
      return NextResponse.json({ message: "Thiếu thông tin." }, { status: 400 });
    }

    const hasPurchased = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        tickets: {
          some: {
            status: "PAID",
          },
        },
        showtime: {
          movieId,
        },
      },
    });

    if (hasPurchased) {
      return NextResponse.json({ allowed: true }, { status: 200 });
    } else {
      return NextResponse.json({ allowed: false, message: "Bạn cần mua vé để bình luận." }, { status: 403 });
    }
  } catch (error) {
    console.error("Check comment permission error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  }
}
