/*
  Warnings:

  - Added the required column `seatCode` to the `ShowtimeSeat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowtimeSeat" ADD COLUMN     "seatCode" TEXT NOT NULL;
