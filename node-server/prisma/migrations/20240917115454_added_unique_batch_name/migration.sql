/*
  Warnings:

  - A unique constraint covering the columns `[batchname]` on the table `Batch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Batch_batchname_key" ON "Batch"("batchname");
