/*
  Warnings:

  - Changed the type of `status` on the `ShowtimeSeat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ShowtimeSeat" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ShowtimeSeatStatus";
