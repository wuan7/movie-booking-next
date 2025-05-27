/*
  Warnings:

  - You are about to drop the column `movieId` on the `Cast` table. All the data in the column will be lost.
  - You are about to drop the `_MovieCast` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MovieCast" DROP CONSTRAINT "_MovieCast_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieCast" DROP CONSTRAINT "_MovieCast_B_fkey";

-- AlterTable
ALTER TABLE "Cast" DROP COLUMN "movieId";

-- DropTable
DROP TABLE "_MovieCast";

-- CreateTable
CREATE TABLE "MovieCast" (
    "movieId" TEXT NOT NULL,
    "castId" TEXT NOT NULL,

    CONSTRAINT "MovieCast_pkey" PRIMARY KEY ("movieId","castId")
);

-- AddForeignKey
ALTER TABLE "MovieCast" ADD CONSTRAINT "MovieCast_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCast" ADD CONSTRAINT "MovieCast_castId_fkey" FOREIGN KEY ("castId") REFERENCES "Cast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
