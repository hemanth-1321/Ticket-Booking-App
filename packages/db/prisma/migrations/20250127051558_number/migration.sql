/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_number_key" ON "Admin"("number");
