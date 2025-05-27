import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        showtime: {
          include: {
            movie: true,
            room: true,
            brand: true,
          },
        },
        tickets: {
          include: {
            showtimeSeat: true,
          },
        },
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
