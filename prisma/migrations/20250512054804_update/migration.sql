/*
  Warnings:

  - You are about to drop the column `cast` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "cast";

-- CreateTable
CREATE TABLE "Cast" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,

    CONSTRAINT "Cast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieCast" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieCast_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MovieCast_B_index" ON "_MovieCast"("B");

-- AddForeignKey
ALTER TABLE "_MovieCast" ADD CONSTRAINT "_MovieCast_A_fkey" FOREIGN KEY ("A") REFERENCES "Cast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieCast" ADD CONSTRAINT "_MovieCast_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
