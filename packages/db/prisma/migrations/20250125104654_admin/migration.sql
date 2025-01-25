/*
  Warnings:

  - You are about to drop the column `eventId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "eventId",
DROP COLUMN "startTime";
