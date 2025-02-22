/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_adminId_key" ON "Event"("adminId");
