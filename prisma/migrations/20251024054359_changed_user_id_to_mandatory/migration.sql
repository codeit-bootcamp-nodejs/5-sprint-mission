/*
  Warnings:

  - Made the column `userId` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Article" DROP CONSTRAINT "Article_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_userId_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
