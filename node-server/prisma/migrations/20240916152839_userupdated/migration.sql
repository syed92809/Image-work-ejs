/*
  Warnings:

  - Added the required column `block` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "block" BOOLEAN NOT NULL,
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;
