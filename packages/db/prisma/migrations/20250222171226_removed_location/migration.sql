/*
  Warnings:

  - You are about to drop the column `LocationId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `location` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_LocationId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "LocationId",
ADD COLUMN     "location" TEXT NOT NULL;

-- DropTable
DROP TABLE "Location";
