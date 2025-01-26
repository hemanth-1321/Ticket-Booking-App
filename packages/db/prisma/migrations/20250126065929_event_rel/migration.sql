/*
  Warnings:

  - Added the required column `capacity` to the `SeatType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeatType" ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "filled" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "SeatType" ADD CONSTRAINT "SeatType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
