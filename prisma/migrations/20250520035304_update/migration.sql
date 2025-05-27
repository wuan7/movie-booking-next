/*
  Warnings:

  - You are about to drop the column `price` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `seatId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the `_BookingToTicket` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookingId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showtimeSeatId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BookingToTicket" DROP CONSTRAINT "_BookingToTicket_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookingToTicket" DROP CONSTRAINT "_BookingToTicket_B_fkey";

-- DropIndex
DROP INDEX "Ticket_seatId_showtimeId_key";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "price",
DROP COLUMN "seatId",
DROP COLUMN "userId",
ADD COLUMN     "bookingId" TEXT NOT NULL,
ADD COLUMN     "showtimeSeatId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_BookingToTicket";

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_showtimeSeatId_fkey" FOREIGN KEY ("showtimeSeatId") REFERENCES "ShowtimeSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
