// /app/api/bookings/route.ts
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, showtimeId, seatIds, totalPrice } = body;

    if (!userId || !showtimeId || !seatIds?.length) {
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
      return NextResponse.json({ message: "Some seats are already booked" }, { status: 409 });
    }

    // Step 2: Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        showtimeId,
        totalPrice,
        tickets: {
          create: seatIds.map((seatId: string) => ({
            showtimeSeatId: seatId,
            showtimeId,
          })),
        },
      },
      include: {
        tickets: true,
      },
    });

    // Step 3: Update seat status to "BOOKED"
    await prisma.showtimeSeat.updateMany({
      where: { id: { in: seatIds } },
      data: { status: "BOOKED" },
    });

    return NextResponse.json({ booking }, { status: 201 });

  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}



