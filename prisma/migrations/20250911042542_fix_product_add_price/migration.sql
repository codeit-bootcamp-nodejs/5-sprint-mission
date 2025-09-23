/*
  Warnings:

  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tags` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Tags" AS ENUM ('FASHION', 'BEAUTY', 'SPORTS', 'ELECTRONICS', 'HOME_INTERIOR', 'HOUSEHOLD_SUPPLIES', 'KITCHENWARE');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" "public"."Tags" NOT NULL;
