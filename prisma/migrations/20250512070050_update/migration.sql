/*
  Warnings:

  - You are about to drop the `_MovieNation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nationId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MovieNation" DROP CONSTRAINT "_MovieNation_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieNation" DROP CONSTRAINT "_MovieNation_B_fkey";

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "nationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_MovieNation";

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_nationId_fkey" FOREIGN KEY ("nationId") REFERENCES "Nation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
