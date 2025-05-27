/*
  Warnings:

  - Added the required column `imagePublicId` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "imagePublicId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;
