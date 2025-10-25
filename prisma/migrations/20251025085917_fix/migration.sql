-- DropForeignKey
ALTER TABLE "public"."ArticleLike" DROP CONSTRAINT "ArticleLike_articleId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ArticleLike" ADD CONSTRAINT "ArticleLike_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
