/*
  Warnings:

  - You are about to drop the column `isLiked` on the `ArticleLike` table. All the data in the column will be lost.
  - You are about to drop the column `isLiked` on the `ProductLike` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ArticleLike" DROP COLUMN "isLiked";

-- AlterTable
ALTER TABLE "public"."ProductLike" DROP COLUMN "isLiked";
