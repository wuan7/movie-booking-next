-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
