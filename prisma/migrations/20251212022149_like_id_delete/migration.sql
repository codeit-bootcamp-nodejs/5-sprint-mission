/*
  Warnings:

  - The primary key for the `ArticleLike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ArticleLike` table. All the data in the column will be lost.
  - The primary key for the `ProductLike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductLike` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ArticleLike" DROP CONSTRAINT "ArticleLike_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "public"."ProductLike" DROP CONSTRAINT "ProductLike_pkey",
DROP COLUMN "id";
