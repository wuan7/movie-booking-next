/*
  Warnings:

  - You are about to drop the column `nation` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "nation";

-- CreateTable
CREATE TABLE "Nation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameUnsigned" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Nation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieNation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieNation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nation_slug_key" ON "Nation"("slug");

-- CreateIndex
CREATE INDEX "_MovieNation_B_index" ON "_MovieNation"("B");

-- AddForeignKey
ALTER TABLE "_MovieNation" ADD CONSTRAINT "_MovieNation_A_fkey" FOREIGN KEY ("A") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieNation" ADD CONSTRAINT "_MovieNation_B_fkey" FOREIGN KEY ("B") REFERENCES "Nation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
