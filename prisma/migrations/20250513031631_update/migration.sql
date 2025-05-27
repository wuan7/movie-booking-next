-- CreateTable
CREATE TABLE "ShowtimeSeat" (
    "id" TEXT NOT NULL,
    "showtimeId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,

    CONSTRAINT "ShowtimeSeat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShowtimeSeat" ADD CONSTRAINT "ShowtimeSeat_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowtimeSeat" ADD CONSTRAINT "ShowtimeSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
