/*
  Warnings:

  - You are about to drop the column `conteent` on the `ArticleComment` table. All the data in the column will be lost.
  - You are about to drop the column `conteent` on the `ProductComment` table. All the data in the column will be lost.
  - Added the required column `content` to the `ArticleComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `ProductComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ArticleComment" DROP COLUMN "conteent",
ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductComment" DROP COLUMN "conteent",
ADD COLUMN     "content" TEXT NOT NULL;
