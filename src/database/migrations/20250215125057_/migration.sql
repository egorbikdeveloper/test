/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Tweet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Tweet";

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
