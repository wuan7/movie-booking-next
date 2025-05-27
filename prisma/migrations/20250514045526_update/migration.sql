-- DropForeignKey
ALTER TABLE "ShowtimeRow" DROP CONSTRAINT "ShowtimeRow_showtimeId_fkey";

-- DropForeignKey
ALTER TABLE "ShowtimeSeat" DROP CONSTRAINT "ShowtimeSeat_rowId_fkey";

-- AddForeignKey
ALTER TABLE "ShowtimeRow" ADD CONSTRAINT "ShowtimeRow_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowtimeSeat" ADD CONSTRAINT "ShowtimeSeat_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "ShowtimeRow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
