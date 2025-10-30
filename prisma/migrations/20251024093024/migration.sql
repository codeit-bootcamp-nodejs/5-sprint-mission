/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "refreshToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;
