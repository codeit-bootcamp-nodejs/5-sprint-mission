-- DropForeignKey
ALTER TABLE "public"."ProductLike" DROP CONSTRAINT "ProductLike_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductLike" DROP CONSTRAINT "ProductLike_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ProductLike" ADD CONSTRAINT "ProductLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductLike" ADD CONSTRAINT "ProductLike_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
