import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { seatIds, showtimeId, status } = body;

    if (!seatIds?.length || !showtimeId || !status) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Step 1: Check if seats are available
    const seats = await prisma.showtimeSeat.findMany({
      where: {
        id: { in: seatIds },
        status: { not: "BOOKED" },
      },
    });

    if (seats.length !== seatIds.length) {
      return NextResponse.json(
        { message: "Some seats are already booked" },
        { status: 409 }
      );
    }

    await prisma.showtimeSeat.updateMany({
      where: { id: { in: seatIds } },
      data: { status},
    });

    const showtime = await prisma.showtime.findFirst({
      where: {
        id: showtimeId,
      },
      include: {
        rows: {
          include: {
            seats: true,
          },
        },
        seatPrices: true,
        brand: {
          include: {
            company: true,
          },
        },
        movie: true,
        room: true,
      },
    });
    return NextResponse.json({ showtime }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
