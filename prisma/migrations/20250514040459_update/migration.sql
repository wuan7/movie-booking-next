/*
  Warnings:

  - You are about to drop the column `isBooked` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the `_SeatToShowtimeRow` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ShowtimeSeatStatus" AS ENUM ('AVAILABLE', 'BOOKED');

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_seatId_fkey";

-- DropForeignKey
ALTER TABLE "_SeatToShowtimeRow" DROP CONSTRAINT "_SeatToShowtimeRow_A_fkey";

-- DropForeignKey
ALTER TABLE "_SeatToShowtimeRow" DROP CONSTRAINT "_SeatToShowtimeRow_B_fkey";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "isBooked";

-- DropTable
DROP TABLE "_SeatToShowtimeRow";

-- CreateTable
CREATE TABLE "ShowtimeSeat" (
    "id" TEXT NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "seatType" TEXT NOT NULL,
    "status" "ShowtimeSeatStatus" NOT NULL,
    "rowId" TEXT NOT NULL,

    CONSTRAINT "ShowtimeSeat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShowtimeSeat" ADD CONSTRAINT "ShowtimeSeat_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "ShowtimeRow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
