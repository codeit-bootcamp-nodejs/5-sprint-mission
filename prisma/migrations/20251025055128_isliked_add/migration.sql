-- AlterTable
ALTER TABLE "public"."Article" ADD COLUMN     "isLiked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "isLiked" BOOLEAN NOT NULL DEFAULT false;
