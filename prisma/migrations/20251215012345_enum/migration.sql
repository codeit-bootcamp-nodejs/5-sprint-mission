/*
  Warnings:

  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('PRODUCT_PRICE_CHANGED', 'ARTICLE_COMMENT_CREATED');

-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "type",
ADD COLUMN     "type" "public"."NotificationType" NOT NULL;
