/*
  Warnings:

  - You are about to drop the `ShowtimeSeat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShowtimeSeat" DROP CONSTRAINT "ShowtimeSeat_seatId_fkey";

-- DropForeignKey
ALTER TABLE "ShowtimeSeat" DROP CONSTRAINT "ShowtimeSeat_showtimeId_fkey";

-- DropTable
DROP TABLE "ShowtimeSeat";

-- CreateTable
CREATE TABLE "ShowtimeRow" (
    "id" TEXT NOT NULL,
    "showtimeId" TEXT NOT NULL,
    "rowName" TEXT NOT NULL,

    CONSTRAINT "ShowtimeRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SeatToShowtimeRow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SeatToShowtimeRow_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SeatToShowtimeRow_B_index" ON "_SeatToShowtimeRow"("B");

-- AddForeignKey
ALTER TABLE "ShowtimeRow" ADD CONSTRAINT "ShowtimeRow_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeatToShowtimeRow" ADD CONSTRAINT "_SeatToShowtimeRow_A_fkey" FOREIGN KEY ("A") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeatToShowtimeRow" ADD CONSTRAINT "_SeatToShowtimeRow_B_fkey" FOREIGN KEY ("B") REFERENCES "ShowtimeRow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
