/*
  Warnings:

  - You are about to drop the column `deteOfBirth` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "deteOfBirth",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3);
