/*
  Warnings:

  - Added the required column `centerType` to the `ShowtimeSeat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowtimeSeat" ADD COLUMN     "centerType" TEXT NOT NULL;
